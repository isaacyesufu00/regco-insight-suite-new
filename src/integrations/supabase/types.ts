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
      compliance_scores: {
        Row: {
          calculated_at: string | null
          created_at: string
          id: string
          score: number
          score_breakdown: Json | null
          status_label: string
          updated_at: string
          user_id: string
        }
        Insert: {
          calculated_at?: string | null
          created_at?: string
          id?: string
          score?: number
          score_breakdown?: Json | null
          status_label?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          calculated_at?: string | null
          created_at?: string
          id?: string
          score?: number
          score_breakdown?: Json | null
          status_label?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          company_name: string
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string | null
          report_type: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone?: string | null
          report_type?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string | null
          report_type?: string | null
        }
        Relationships: []
      }
      email_reminders: {
        Row: {
          id: string
          reminder_type: string
          report_type: string
          reporting_period: string
          sent_at: string
          user_id: string
        }
        Insert: {
          id?: string
          reminder_type: string
          report_type: string
          reporting_period: string
          sent_at?: string
          user_id: string
        }
        Update: {
          id?: string
          reminder_type?: string
          report_type?: string
          reporting_period?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      institution_report_types: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          report_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          report_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          report_type?: string
          user_id?: string
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempt_count: number
          email: string
          id: string
          last_attempt_at: string | null
          locked_until: string | null
        }
        Insert: {
          attempt_count?: number
          email: string
          id?: string
          last_attempt_at?: string | null
          locked_until?: string | null
        }
        Update: {
          attempt_count?: number
          email?: string
          id?: string
          last_attempt_at?: string | null
          locked_until?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string
          cbn_license_category: string | null
          company_name: string | null
          compliance_lead_name: string | null
          created_at: string
          full_name: string | null
          id: string
          notification_email_report_ready: boolean
          phone: string | null
          rc_number: string | null
        }
        Insert: {
          account_status?: string
          cbn_license_category?: string | null
          company_name?: string | null
          compliance_lead_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          notification_email_report_ready?: boolean
          phone?: string | null
          rc_number?: string | null
        }
        Update: {
          account_status?: string
          cbn_license_category?: string | null
          company_name?: string | null
          compliance_lead_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          notification_email_report_ready?: boolean
          phone?: string | null
          rc_number?: string | null
        }
        Relationships: []
      }
      report_requests: {
        Row: {
          created_at: string
          data_source_id: string | null
          form_data: Json
          id: string
          institution_name: string
          rc_number: string | null
          report_type: string
          reporting_period_end: string
          reporting_period_start: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_source_id?: string | null
          form_data?: Json
          id?: string
          institution_name: string
          rc_number?: string | null
          report_type: string
          reporting_period_end: string
          reporting_period_start: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_source_id?: string | null
          form_data?: Json
          id?: string
          institution_name?: string
          rc_number?: string | null
          report_type?: string
          reporting_period_end?: string
          reporting_period_start?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      report_statuses: {
        Row: {
          created_at: string
          id: string
          report_name: string
          report_subtype: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          report_name: string
          report_subtype: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          report_name?: string
          report_subtype?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          docx_url: string | null
          file_path: string | null
          id: string
          pdf_url: string | null
          report_name: string
          report_type: string | null
          reporting_period_end: string | null
          reporting_period_start: string | null
          status: string
          user_id: string
          xlsx_url: string | null
        }
        Insert: {
          created_at?: string
          docx_url?: string | null
          file_path?: string | null
          id?: string
          pdf_url?: string | null
          report_name: string
          report_type?: string | null
          reporting_period_end?: string | null
          reporting_period_start?: string | null
          status?: string
          user_id: string
          xlsx_url?: string | null
        }
        Update: {
          created_at?: string
          docx_url?: string | null
          file_path?: string | null
          id?: string
          pdf_url?: string | null
          report_name?: string
          report_type?: string | null
          reporting_period_end?: string | null
          reporting_period_start?: string | null
          status?: string
          user_id?: string
          xlsx_url?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          institution_name: string
          message: string
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          institution_name?: string
          message: string
          status?: string
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          institution_name?: string
          message?: string
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string
          id: string
          on_time_rate: number
          reports_filed: number
          updated_at: string
          user_id: string
          violations: number
        }
        Insert: {
          created_at?: string
          id?: string
          on_time_rate?: number
          reports_filed?: number
          updated_at?: string
          user_id: string
          violations?: number
        }
        Update: {
          created_at?: string
          id?: string
          on_time_rate?: number
          reports_filed?: number
          updated_at?: string
          user_id?: string
          violations?: number
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
      app_role: "admin" | "user" | "compliance_lead"
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
      app_role: ["admin", "user", "compliance_lead"],
    },
  },
} as const
