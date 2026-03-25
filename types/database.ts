export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      musics: {
        Row: {
          created_at: string | null
          duration: number | null
          file_path: string | null
          id: string
          prompt: string
          status: string
          title: string | null
          type: Database["public"]["Enums"]["music_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          file_path?: string | null
          id?: string
          prompt: string
          status?: string
          title?: string | null
          type?: Database["public"]["Enums"]["music_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          file_path?: string | null
          id?: string
          prompt?: string
          status?: string
          title?: string | null
          type?: Database["public"]["Enums"]["music_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "musics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      music_type: "music" | "sfx"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]

// Convenience types
export type MusicRow = Tables<"musics">
export type MusicInsert = TablesInsert<"musics">
export type MusicType = Enums<"music_type">

export const Constants = {
  public: {
    Enums: {
      music_type: ["music", "sfx"] as const,
    },
  },
} as const
