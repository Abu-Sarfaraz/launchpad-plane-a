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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      deployment_logs: {
        Row: {
          commit_sha: string | null
          created_at: string
          id: string
          project_id: string
          status: string
          vercel_deployment_id: string | null
          web_vitals: Json
        }
        Insert: {
          commit_sha?: string | null
          created_at?: string
          id?: string
          project_id: string
          status?: string
          vercel_deployment_id?: string | null
          web_vitals?: Json
        }
        Update: {
          commit_sha?: string | null
          created_at?: string
          id?: string
          project_id?: string
          status?: string
          vercel_deployment_id?: string | null
          web_vitals?: Json
        }
        Relationships: [
          {
            foreignKeyName: "deployment_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_pdfs: {
        Row: {
          created_at: string
          download_url: string | null
          file_name: string
          file_size_bytes: number
          id: string
          include_mark_scheme: boolean
          mock_paper_id: string
          storage_path: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          download_url?: string | null
          file_name: string
          file_size_bytes?: number
          id?: string
          include_mark_scheme?: boolean
          mock_paper_id: string
          storage_path?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          download_url?: string | null
          file_name?: string
          file_size_bytes?: number
          id?: string
          include_mark_scheme?: boolean
          mock_paper_id?: string
          storage_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_pdfs_mock_paper_id_fkey"
            columns: ["mock_paper_id"]
            isOneToOne: false
            referencedRelation: "mock_papers"
            referencedColumns: ["id"]
          },
        ]
      }
      institutes: {
        Row: {
          created_at: string
          id: string
          logo_storage_path: string | null
          logo_url: string | null
          name: string
          official_cover_page_enabled: boolean
          owner_id: string
          student_header_enabled: boolean
          subtitle: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_storage_path?: string | null
          logo_url?: string | null
          name: string
          official_cover_page_enabled?: boolean
          owner_id: string
          student_header_enabled?: boolean
          subtitle?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_storage_path?: string | null
          logo_url?: string | null
          name?: string
          official_cover_page_enabled?: boolean
          owner_id?: string
          student_header_enabled?: boolean
          subtitle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_papers: {
        Row: {
          branding_config: Json
          created_at: string
          difficulty_profile: string
          duration_minutes: number
          id: string
          institute_id: string | null
          question_ids: Json
          questions_snapshot: Json
          target_marks: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          branding_config?: Json
          created_at?: string
          difficulty_profile?: string
          duration_minutes?: number
          id?: string
          institute_id?: string | null
          question_ids?: Json
          questions_snapshot?: Json
          target_marks?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          branding_config?: Json
          created_at?: string
          difficulty_profile?: string
          duration_minutes?: number
          id?: string
          institute_id?: string | null
          question_ids?: Json
          questions_snapshot?: Json
          target_marks?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_papers_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          organization_id: string
          payment_intent_id: string | null
          status: string
          tier: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          organization_id: string
          payment_intent_id?: string | null
          status?: string
          tier?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          organization_id?: string
          payment_intent_id?: string | null
          status?: string
          tier?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          billing_tier: string
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          billing_tier?: string
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          billing_tier?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_super_admin: boolean
          preferences: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_super_admin?: boolean
          preferences?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_super_admin?: boolean
          preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          design_md: string | null
          github_repo_url: string | null
          id: string
          name: string
          organization_id: string
          slug: string
          stitch_project_id: string | null
          updated_at: string
          vercel_project_id: string | null
        }
        Insert: {
          created_at?: string
          design_md?: string | null
          github_repo_url?: string | null
          id?: string
          name: string
          organization_id: string
          slug: string
          stitch_project_id?: string | null
          updated_at?: string
          vercel_project_id?: string | null
        }
        Update: {
          created_at?: string
          design_md?: string | null
          github_repo_url?: string | null
          id?: string
          name?: string
          organization_id?: string
          slug?: string
          stitch_project_id?: string | null
          updated_at?: string
          vercel_project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_bank: {
        Row: {
          code: string
          created_at: string
          curriculum: string
          difficulty_level: string
          id: string
          latex_prompt: string
          mark_scheme_latex: string
          marks: number
          subject_code: string
          subject_name: string
          topic_category: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          curriculum?: string
          difficulty_level: string
          id?: string
          latex_prompt: string
          mark_scheme_latex: string
          marks?: number
          subject_code?: string
          subject_name?: string
          topic_category: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          curriculum?: string
          difficulty_level?: string
          id?: string
          latex_prompt?: string
          mark_scheme_latex?: string
          marks?: number
          subject_code?: string
          subject_name?: string
          topic_category?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bootstrap_first_admin: {
        Args: { admin_user_id: string }
        Returns: boolean
      }
      is_org_admin: { Args: { org_id: string; uid?: string }; Returns: boolean }
      is_org_member: {
        Args: { org_id: string; uid?: string }
        Returns: boolean
      }
      is_platform_admin: { Args: { uid?: string }; Returns: boolean }
      porikkhon: { Args: { action: string; data?: Json }; Returns: Json }
      porikkhon_leaderboard: { Args: never; Returns: Json }
      porikkhon_payment_confirm: {
        Args: { order_id: string; validation_id: string }
        Returns: boolean
      }
      porikkhon_payment_order: { Args: { order_id: string }; Returns: Json }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
