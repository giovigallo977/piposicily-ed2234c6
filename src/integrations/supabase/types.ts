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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      collection_hotspots: {
        Row: {
          collection_id: string
          created_at: string
          hotspot_id: string
          id: string
          ordine: number | null
        }
        Insert: {
          collection_id: string
          created_at?: string
          hotspot_id: string
          id?: string
          ordine?: number | null
        }
        Update: {
          collection_id?: string
          created_at?: string
          hotspot_id?: string
          id?: string
          ordine?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_hotspots_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_hotspots_hotspot_id_fkey"
            columns: ["hotspot_id"]
            isOneToOne: false
            referencedRelation: "hotspots"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          descrizione: string | null
          id: string
          immagine: string | null
          nome: string
          ordine: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descrizione?: string | null
          id?: string
          immagine?: string | null
          nome: string
          ordine?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descrizione?: string | null
          id?: string
          immagine?: string | null
          nome?: string
          ordine?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hotspots: {
        Row: {
          categoria: string | null
          created_at: string
          descrizione_breve: string
          descrizione_completa: string
          foto_gallery: string[] | null
          foto_principale: string | null
          id: string
          link_google_maps: string | null
          ordine: number | null
          style_badge_bg_color: string | null
          style_badge_text_color: string | null
          style_body_font: string | null
          style_body_font_bold: boolean | null
          style_body_font_size: string | null
          style_body_font_weight: number | null
          style_button_font: string | null
          style_button_font_bold: boolean | null
          style_button_font_size: string | null
          style_button_font_weight: number | null
          style_card_bg_color: string | null
          style_cta_btn_color: string | null
          style_cta_btn_text_color: string | null
          style_expand_btn_color: string | null
          style_font_color: string | null
          style_tag_font: string | null
          style_tag_font_size: string | null
          style_tag_font_weight: number | null
          style_title_font: string | null
          style_title_font_bold: boolean | null
          style_title_font_size: string | null
          style_title_font_weight: number | null
          tags: string[] | null
          titolo: string
          updated_at: string
          zona: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          descrizione_breve: string
          descrizione_completa: string
          foto_gallery?: string[] | null
          foto_principale?: string | null
          id?: string
          link_google_maps?: string | null
          ordine?: number | null
          style_badge_bg_color?: string | null
          style_badge_text_color?: string | null
          style_body_font?: string | null
          style_body_font_bold?: boolean | null
          style_body_font_size?: string | null
          style_body_font_weight?: number | null
          style_button_font?: string | null
          style_button_font_bold?: boolean | null
          style_button_font_size?: string | null
          style_button_font_weight?: number | null
          style_card_bg_color?: string | null
          style_cta_btn_color?: string | null
          style_cta_btn_text_color?: string | null
          style_expand_btn_color?: string | null
          style_font_color?: string | null
          style_tag_font?: string | null
          style_tag_font_size?: string | null
          style_tag_font_weight?: number | null
          style_title_font?: string | null
          style_title_font_bold?: boolean | null
          style_title_font_size?: string | null
          style_title_font_weight?: number | null
          tags?: string[] | null
          titolo: string
          updated_at?: string
          zona?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string
          descrizione_breve?: string
          descrizione_completa?: string
          foto_gallery?: string[] | null
          foto_principale?: string | null
          id?: string
          link_google_maps?: string | null
          ordine?: number | null
          style_badge_bg_color?: string | null
          style_badge_text_color?: string | null
          style_body_font?: string | null
          style_body_font_bold?: boolean | null
          style_body_font_size?: string | null
          style_body_font_weight?: number | null
          style_button_font?: string | null
          style_button_font_bold?: boolean | null
          style_button_font_size?: string | null
          style_button_font_weight?: number | null
          style_card_bg_color?: string | null
          style_cta_btn_color?: string | null
          style_cta_btn_text_color?: string | null
          style_expand_btn_color?: string | null
          style_font_color?: string | null
          style_tag_font?: string | null
          style_tag_font_size?: string | null
          style_tag_font_weight?: number | null
          style_title_font?: string | null
          style_title_font_bold?: boolean | null
          style_title_font_size?: string | null
          style_title_font_weight?: number | null
          tags?: string[] | null
          titolo?: string
          updated_at?: string
          zona?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_premium: boolean
          premium_since: string | null
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_premium?: boolean
          premium_since?: string | null
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_premium?: boolean
          premium_since?: string | null
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: string
          created_at: string
          id: string
          key: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          key: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      style_settings: {
        Row: {
          badge_bg_color: string | null
          badge_text_color: string | null
          body_font: string | null
          body_font_bold: boolean | null
          body_font_size: string | null
          body_font_weight: number | null
          button_font: string | null
          button_font_bold: boolean | null
          button_font_size: string | null
          button_font_weight: number | null
          card_bg_color: string | null
          created_at: string
          cta_btn_color: string | null
          cta_btn_text_color: string | null
          expand_btn_color: string | null
          filter_btn_active_bg_color: string | null
          filter_btn_bg_color: string | null
          filter_btn_icon_color: string | null
          font_color: string | null
          hamburger_btn_bg_color: string | null
          hamburger_btn_icon_color: string | null
          id: string
          key: string
          tag_font: string | null
          tag_font_size: string | null
          tag_font_weight: number | null
          title_font: string | null
          title_font_bold: boolean | null
          title_font_size: string | null
          title_font_weight: number | null
          updated_at: string
        }
        Insert: {
          badge_bg_color?: string | null
          badge_text_color?: string | null
          body_font?: string | null
          body_font_bold?: boolean | null
          body_font_size?: string | null
          body_font_weight?: number | null
          button_font?: string | null
          button_font_bold?: boolean | null
          button_font_size?: string | null
          button_font_weight?: number | null
          card_bg_color?: string | null
          created_at?: string
          cta_btn_color?: string | null
          cta_btn_text_color?: string | null
          expand_btn_color?: string | null
          filter_btn_active_bg_color?: string | null
          filter_btn_bg_color?: string | null
          filter_btn_icon_color?: string | null
          font_color?: string | null
          hamburger_btn_bg_color?: string | null
          hamburger_btn_icon_color?: string | null
          id?: string
          key: string
          tag_font?: string | null
          tag_font_size?: string | null
          tag_font_weight?: number | null
          title_font?: string | null
          title_font_bold?: boolean | null
          title_font_size?: string | null
          title_font_weight?: number | null
          updated_at?: string
        }
        Update: {
          badge_bg_color?: string | null
          badge_text_color?: string | null
          body_font?: string | null
          body_font_bold?: boolean | null
          body_font_size?: string | null
          body_font_weight?: number | null
          button_font?: string | null
          button_font_bold?: boolean | null
          button_font_size?: string | null
          button_font_weight?: number | null
          card_bg_color?: string | null
          created_at?: string
          cta_btn_color?: string | null
          cta_btn_text_color?: string | null
          expand_btn_color?: string | null
          filter_btn_active_bg_color?: string | null
          filter_btn_bg_color?: string | null
          filter_btn_icon_color?: string | null
          font_color?: string | null
          hamburger_btn_bg_color?: string | null
          hamburger_btn_icon_color?: string | null
          id?: string
          key?: string
          tag_font?: string | null
          tag_font_size?: string | null
          tag_font_weight?: number | null
          title_font?: string | null
          title_font_bold?: boolean | null
          title_font_size?: string | null
          title_font_weight?: number | null
          updated_at?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
