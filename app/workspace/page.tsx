"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/workspace/Navbar";
import { PromptInputBox } from "@/components/workspace/PromptInputBox";

export default function WorkspacePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/auth");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) return null;

    return (
        <main
            className="min-h-screen flex flex-col"
            style={{ background: "#171717" }}
        >
            <Navbar />

            {/* Content */}
            <div className="flex-1" />

            {/* Fixed bottom prompt */}
            <div className="fixed bottom-0 left-0 right-0 flex justify-center px-6 pb-6 pointer-events-none">
                <div className="w-full max-w-[38rem] pointer-events-auto">
                    <PromptInputBox />
                </div>
            </div>
        </main>
    );
}
