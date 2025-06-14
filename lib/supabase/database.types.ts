export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: "free" | "pro"
          subscription_status: "active" | "cancelled" | "past_due"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "pro"
          subscription_status?: "active" | "cancelled" | "past_due"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "pro"
          subscription_status?: "active" | "cancelled" | "past_due"
          created_at?: string
          updated_at?: string
        }
      }
      stories: {
        Row: {
          id: string
          user_id: string
          title: string
          author: string | null
          genre: string | null
          status: "planning" | "writing" | "editing" | "complete"
          word_count_goal: number | null
          current_word_count: number
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          author?: string | null
          genre?: string | null
          status?: "planning" | "writing" | "editing" | "complete"
          word_count_goal?: number | null
          current_word_count?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          author?: string | null
          genre?: string | null
          status?: "planning" | "writing" | "editing" | "complete"
          word_count_goal?: number | null
          current_word_count?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          story_id: string
          slug: string
          title: string
          chapter_number: number
          status: "draft" | "review" | "complete" | "published"
          word_count: number
          pov: string | null
          location: string | null
          timeline: string | null
          summary: string | null
          content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          story_id: string
          slug: string
          title: string
          chapter_number: number
          status?: "draft" | "review" | "complete" | "published"
          word_count?: number
          pov?: string | null
          location?: string | null
          timeline?: string | null
          summary?: string | null
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          slug?: string
          title?: string
          chapter_number?: number
          status?: "draft" | "review" | "complete" | "published"
          word_count?: number
          pov?: string | null
          location?: string | null
          timeline?: string | null
          summary?: string | null
          content?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      characters: {
        Row: {
          id: string
          story_id: string
          slug: string
          name: string
          role: string | null
          age: number | null
          status: "alive" | "deceased" | "missing" | "unknown"
          location: string | null
          affiliations: string[] | null
          relationships: string[] | null
          first_appearance: string | null
          description: string | null
          backstory: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          story_id: string
          slug: string
          name: string
          role?: string | null
          age?: number | null
          status?: "alive" | "deceased" | "missing" | "unknown"
          location?: string | null
          affiliations?: string[] | null
          relationships?: string[] | null
          first_appearance?: string | null
          description?: string | null
          backstory?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          slug?: string
          name?: string
          role?: string | null
          age?: number | null
          status?: "alive" | "deceased" | "missing" | "unknown"
          location?: string | null
          affiliations?: string[] | null
          relationships?: string[] | null
          first_appearance?: string | null
          description?: string | null
          backstory?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          story_id: string
          slug: string
          name: string
          type: "city" | "building" | "landmark" | "region" | "other" | null
          description: string | null
          significance: string | null
          parent_location: string | null
          climate: string | null
          population: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          story_id: string
          slug: string
          name: string
          type?: "city" | "building" | "landmark" | "region" | "other" | null
          description?: string | null
          significance?: string | null
          parent_location?: string | null
          climate?: string | null
          population?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          slug?: string
          name?: string
          type?: "city" | "building" | "landmark" | "region" | "other" | null
          description?: string | null
          significance?: string | null
          parent_location?: string | null
          climate?: string | null
          population?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      scenes: {
        Row: {
          id: string
          chapter_id: string
          slug: string
          title: string
          order_index: number
          summary: string | null
          content: string | null
          characters: string[] | null
          location: string | null
          timeline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          slug: string
          title: string
          order_index: number
          summary?: string | null
          content?: string | null
          characters?: string[] | null
          location?: string | null
          timeline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          slug?: string
          title?: string
          order_index?: number
          summary?: string | null
          content?: string | null
          characters?: string[] | null
          location?: string | null
          timeline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      story_images: {
        Row: {
          id: string
          story_id: string
          filename: string
          storage_path: string
          alt_text: string | null
          image_type: "character" | "location" | "scene" | "reference" | null
          connected_characters: string[] | null
          connected_locations: string[] | null
          connected_chapters: string[] | null
          connected_scenes: string[] | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          story_id: string
          filename: string
          storage_path: string
          alt_text?: string | null
          image_type?: "character" | "location" | "scene" | "reference" | null
          connected_characters?: string[] | null
          connected_locations?: string[] | null
          connected_chapters?: string[] | null
          connected_scenes?: string[] | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          filename?: string
          storage_path?: string
          alt_text?: string | null
          image_type?: "character" | "location" | "scene" | "reference" | null
          connected_characters?: string[] | null
          connected_locations?: string[] | null
          connected_chapters?: string[] | null
          connected_scenes?: string[] | null
          tags?: string[] | null
          created_at?: string
        }
      }
    }
  }
}
