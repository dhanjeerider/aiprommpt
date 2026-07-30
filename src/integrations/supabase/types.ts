export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      libraries: {
        Row: {
          cover_gradient: string | null
          cover_image: string | null
          created_at: string
          description: string
          id: string
          prompt_count: number
          published: boolean
          slug: string
          sort_order: number
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          cover_gradient?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: string
          prompt_count?: number
          published?: boolean
          slug: string
          sort_order?: number
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          cover_gradient?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: string
          prompt_count?: number
          published?: boolean
          slug?: string
          sort_order?: number
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          body_md: string
          created_at: string
          id: string
          published: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body_md?: string
          created_at?: string
          id?: string
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body_md?: string
          created_at?: string
          id?: string
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_saves: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_name: string
          category: string | null
          content_prompt: string
          copies: number
          created_at: string
          excerpt: string
          extra_images: string[]
          extra_prompts: string[]
          featured_image: string
          id: string
          library_slug: string | null
          likes: number
          premium: boolean
          prompt_images: string[]
          published: boolean
          rating: number
          saves: number
          slug: string
          style: string | null
          tags: string[]
          title: string
          tool: string | null
          updated_at: string
        }
        Insert: {
          author_name?: string
          category?: string | null
          content_prompt?: string
          copies?: number
          created_at?: string
          excerpt?: string
          extra_images?: string[]
          extra_prompts?: string[]
          featured_image?: string
          id?: string
          library_slug?: string | null
          likes?: number
          premium?: boolean
          prompt_images?: string[]
          published?: boolean
          rating?: number
          saves?: number
          slug: string
          style?: string | null
          tags?: string[]
          title: string
          tool?: string | null
          updated_at?: string
        }
        Update: {
          author_name?: string
          category?: string | null
          content_prompt?: string
          copies?: number
          created_at?: string
          excerpt?: string
          extra_images?: string[]
          extra_prompts?: string[]
          featured_image?: string
          id?: string
          library_slug?: string | null
          likes?: number
          premium?: boolean
          prompt_images?: string[]
          published?: boolean
          rating?: number
          saves?: number
          slug?: string
          style?: string | null
          tags?: string[]
          title?: string
          tool?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      premium_orders: {
        Row: {
          admin_note: string | null
          amount: string | null
          created_at: string
          email: string
          id: string
          screenshot_url: string
          status: string
          updated_at: string
          user_id: string | null
          utr: string
        }
        Insert: {
          admin_note?: string | null
          amount?: string | null
          created_at?: string
          email: string
          id?: string
          screenshot_url: string
          status?: string
          updated_at?: string
          user_id?: string | null
          utr: string
        }
        Update: {
          admin_note?: string | null
          amount?: string | null
          created_at?: string
          email?: string
          id?: string
          screenshot_url?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          utr?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          ad_slot_detail: string | null
          ad_slot_grid: string | null
          ad_slot_sidebar: string | null
          adsense_client: string | null
          analytics_gtag: string | null
          favicon_url: string | null
          footer_links: Json
          hero_gradient_text: string
          hero_subtitle: string
          hero_title: string
          id: number
          logo_url: string | null
          popular_tags: string[]
          premium_currency: string | null
          premium_note: string | null
          premium_price: string | null
          site_tagline: string
          site_title: string
          updated_at: string
          upi_id: string | null
          upi_qr_url: string | null
        }
        Insert: {
          ad_slot_detail?: string | null
          ad_slot_grid?: string | null
          ad_slot_sidebar?: string | null
          adsense_client?: string | null
          analytics_gtag?: string | null
          favicon_url?: string | null
          footer_links?: Json
          hero_gradient_text?: string
          hero_subtitle?: string
          hero_title?: string
          id?: number
          logo_url?: string | null
          popular_tags?: string[]
          premium_currency?: string | null
          premium_note?: string | null
          premium_price?: string | null
          site_tagline?: string
          site_title?: string
          updated_at?: string
          upi_id?: string | null
          upi_qr_url?: string | null
        }
        Update: {
          ad_slot_detail?: string | null
          ad_slot_grid?: string | null
          ad_slot_sidebar?: string | null
          adsense_client?: string | null
          analytics_gtag?: string | null
          favicon_url?: string | null
          footer_links?: Json
          hero_gradient_text?: string
          hero_subtitle?: string
          hero_title?: string
          id?: number
          logo_url?: string | null
          popular_tags?: string[]
          premium_currency?: string | null
          premium_note?: string | null
          premium_price?: string | null
          site_tagline?: string
          site_title?: string
          updated_at?: string
          upi_id?: string | null
          upi_qr_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
