import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";
import type { Database, MusicType } from "@/types/database";

export const maxDuration = 300;

async function resolveUrl(item: unknown): Promise<string> {
  if (typeof item === "string") return item;
  if (item && typeof (item as { url?: () => string }).url === "function") {
    return (item as { url: () => string }).url();
  }
  const s = String(item);
  if (s.startsWith("http")) return s;
  throw new Error(`Unexpected Replicate output format: ${s}`);
}

export async function POST(request: Request) {
  const recordIds: string[] = [];

  try {
    const {
      prompt,
      type = "music",
      lyrics: userLyrics = "",
      duration = 60,
      batchSize = 1,
    } = (await request.json()) as {
      prompt: string;
      type: MusicType;
      lyrics?: string;
      duration?: number;
      batchSize?: number;
    };

    console.log("[generate-music] Request:", { prompt, type, duration, batchSize, hasLyrics: !!userLyrics });

    if (!prompt?.trim()) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    // ── Auth ──────────────────────────────────────────────────────────────────
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLL_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (!user || authError) {
      console.error("[generate-music] Unauthorized:", authError?.message);
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("[generate-music] User:", user.id);

    // ── Create processing records (one per batch item) ─────────────────────────
    const clampedBatch = Math.min(Math.max(1, batchSize), 4);
    const insertData = Array.from({ length: clampedBatch }, () => ({
      user_id: user.id,
      prompt,
      type,
      status: "processing",
    }));

    const { data: records, error: dbError } = await supabase
      .from("musics")
      .insert(insertData)
      .select();

    if (dbError || !records || records.length === 0) {
      console.error("[generate-music] DB insert error:", dbError);
      return Response.json({ error: "Failed to create record", details: dbError }, { status: 500 });
    }
    records.forEach((r) => recordIds.push(r.id));
    console.log("[generate-music] Created records:", recordIds);

    // ── Build Replicate input ─────────────────────────────────────────────────
    let lyricsParam: string;
    if (type === "sfx") {
      lyricsParam = `[sfx]\n${prompt}`;
    } else if (userLyrics.trim()) {
      lyricsParam = userLyrics;
    } else {
      lyricsParam = "[inst]";
    }

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    console.log("[generate-music] Calling Replicate...");

    const rawOutput = await replicate.run(
      "visoar/ace-step-1.5:fd851baef553cb1656f4a05e8f2f8641672f10bc808718f5718b4b4bb2b07794",
      {
        input: {
          caption: prompt,
          lyrics: lyricsParam,
          duration,
          batch_size: clampedBatch,
        },
      }
    );
    console.log("[generate-music] Replicate output received");

    const outputs = Array.isArray(rawOutput) ? rawOutput : [rawOutput];

    // ── Upload each output and update its record ───────────────────────────────
    for (let i = 0; i < outputs.length && i < records.length; i++) {
      const item = outputs[i];
      const record = records[i];

      if (!item) {
        await supabase.from("musics").update({ status: "failed" }).eq("id", record.id);
        continue;
      }

      let audioUrl: string;
      try {
        audioUrl = await resolveUrl(item);
      } catch (e) {
        console.error(`[generate-music] Could not resolve URL for item ${i}:`, e);
        await supabase.from("musics").update({ status: "failed" }).eq("id", record.id);
        continue;
      }

      console.log(`[generate-music] Downloading item ${i}:`, audioUrl);
      const audioResponse = await fetch(audioUrl);
      if (!audioResponse.ok) {
        await supabase.from("musics").update({ status: "failed" }).eq("id", record.id);
        continue;
      }

      const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
      const filePath = `${user.id}/${record.id}.mp3`;

      const { error: storageError } = await supabase.storage
        .from("musics")
        .upload(filePath, audioBuffer, { contentType: "audio/mpeg", upsert: true });

      const finalPath = storageError ? audioUrl : filePath;
      if (storageError) {
        console.warn(`[generate-music] Storage upload failed for item ${i}:`, storageError.message);
      }

      await supabase
        .from("musics")
        .update({ status: "completed", file_path: finalPath, duration })
        .eq("id", record.id);
      console.log(`[generate-music] Record ${record.id} completed.`);
    }

    // Mark any surplus records as failed (outputs fewer than requested)
    for (let i = outputs.length; i < records.length; i++) {
      await supabase.from("musics").update({ status: "failed" }).eq("id", records[i].id);
    }

    return Response.json({ success: true, ids: recordIds });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[generate-music] error:", message);

    if (recordIds.length > 0) {
      try {
        const supabase = createClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLL_KEY!,
          { auth: { persistSession: false, autoRefreshToken: false } }
        );
        for (const id of recordIds) {
          await supabase.from("musics").update({ status: "failed" }).eq("id", id);
        }
        console.log("[generate-music] Marked all records as failed.");
      } catch (updateErr) {
        console.error("[generate-music] Failed to update record statuses:", updateErr);
      }
    }

    return Response.json({ error: "Generation failed", detail: message }, { status: 500 });
  }
}
