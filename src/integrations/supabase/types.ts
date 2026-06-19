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
      account_actions: {
        Row: {
          account_number: string
          action: string
          approved_at: string | null
          approved_by: string | null
          case_id: string | null
          created_at: string
          id: string
          reason: string | null
          requested_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number: string
          action: string
          approved_at?: string | null
          approved_by?: string | null
          case_id?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          requested_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string
          action?: string
          approved_at?: string | null
          approved_by?: string | null
          case_id?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          requested_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_actions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      adverse_media_cache: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          query: string
          query_hash: string
          result: Json
          years: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          query: string
          query_hash: string
          result: Json
          years: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          query?: string
          query_hash?: string
          result?: Json
          years?: number
        }
        Relationships: []
      }
      agent_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_messages: {
        Row: {
          action_payload: Json | null
          action_type: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          parts: Json | null
          role: string
          user_id: string
        }
        Insert: {
          action_payload?: Json | null
          action_type?: string | null
          content?: string
          conversation_id: string
          created_at?: string
          id?: string
          parts?: Json | null
          role: string
          user_id: string
        }
        Update: {
          action_payload?: Json | null
          action_type?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          parts?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tool_invocations: {
        Row: {
          args: Json | null
          conversation_id: string | null
          created_at: string
          error: string | null
          id: string
          latency_ms: number | null
          message_id: string | null
          result_summary: string | null
          status: string
          tool_name: string
          user_id: string
        }
        Insert: {
          args?: Json | null
          conversation_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          latency_ms?: number | null
          message_id?: string | null
          result_summary?: string | null
          status?: string
          tool_name: string
          user_id: string
        }
        Update: {
          args?: Json | null
          conversation_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          latency_ms?: number | null
          message_id?: string | null
          result_summary?: string | null
          status?: string
          tool_name?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_issues: {
        Row: {
          category: string | null
          closed_date: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          evidence_notes: string | null
          examination_date: string | null
          id: string
          issue_ref: string | null
          owner_email: string | null
          owner_name: string | null
          regulator: string | null
          remediation_plan: string | null
          severity: string | null
          source: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          closed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          evidence_notes?: string | null
          examination_date?: string | null
          id?: string
          issue_ref?: string | null
          owner_email?: string | null
          owner_name?: string | null
          regulator?: string | null
          remediation_plan?: string | null
          severity?: string | null
          source: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          closed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          evidence_notes?: string | null
          examination_date?: string | null
          id?: string
          issue_ref?: string | null
          owner_email?: string | null
          owner_name?: string | null
          regulator?: string | null
          remediation_plan?: string | null
          severity?: string | null
          source?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      case_artifacts: {
        Row: {
          body: string | null
          case_id: string
          created_at: string
          id: string
          kind: string
          metadata: Json | null
          storage_path: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          case_id: string
          created_at?: string
          id?: string
          kind: string
          metadata?: Json | null
          storage_path?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          case_id?: string
          created_at?: string
          id?: string
          kind?: string
          metadata?: Json | null
          storage_path?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_artifacts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_events: {
        Row: {
          actor_id: string | null
          actor_kind: string
          case_id: string
          created_at: string
          event_type: string
          hash: string
          id: string
          payload: Json
          prev_hash: string | null
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_kind?: string
          case_id: string
          created_at?: string
          event_type: string
          hash: string
          id?: string
          payload?: Json
          prev_hash?: string | null
          user_id: string
        }
        Update: {
          actor_id?: string | null
          actor_kind?: string
          case_id?: string
          created_at?: string
          event_type?: string
          hash?: string
          id?: string
          payload?: Json
          prev_hash?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          assignee_id: string | null
          closed_at: string | null
          created_at: string
          customer_id: string | null
          id: string
          opened_at: string
          severity: string
          status: string
          summary: string | null
          title: string
          trigger_id: string | null
          trigger_kind: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee_id?: string | null
          closed_at?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          opened_at?: string
          severity?: string
          status?: string
          summary?: string | null
          title: string
          trigger_id?: string | null
          trigger_kind?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee_id?: string | null
          closed_at?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          opened_at?: string
          severity?: string
          status?: string
          summary?: string | null
          title?: string
          trigger_id?: string | null
          trigger_kind?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_messages: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          is_pinned: boolean
          is_read: boolean
          sender_name: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          category?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          is_read?: boolean
          sender_name?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          is_read?: boolean
          sender_name?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_reports: {
        Row: {
          content: string | null
          created_at: string | null
          generated_at: string | null
          id: string
          metrics: Json | null
          month: string
          report_type: string | null
          status: string | null
          storage_path: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          generated_at?: string | null
          id?: string
          metrics?: Json | null
          month: string
          report_type?: string | null
          status?: string | null
          storage_path?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          generated_at?: string | null
          id?: string
          metrics?: Json | null
          month?: string
          report_type?: string | null
          status?: string | null
          storage_path?: string | null
          user_id?: string
        }
        Relationships: []
      }
      compliance_score_history: {
        Row: {
          breakdown: Json | null
          id: string
          month: string
          recorded_at: string
          score: number
          user_id: string
        }
        Insert: {
          breakdown?: Json | null
          id?: string
          month: string
          recorded_at?: string
          score: number
          user_id: string
        }
        Update: {
          breakdown?: Json | null
          id?: string
          month?: string
          recorded_at?: string
          score?: number
          user_id?: string
        }
        Relationships: []
      }
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
      customer_accounts: {
        Row: {
          account_number: string
          account_type: string | null
          balance: number | null
          branch: string | null
          created_at: string
          currency: string | null
          customer_id: string | null
          id: string
          open_date: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          account_type?: string | null
          balance?: number | null
          branch?: string | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          id?: string
          open_date?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          account_type?: string | null
          balance?: number | null
          branch?: string | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          id?: string
          open_date?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_accounts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_kyc: {
        Row: {
          address_verified: boolean | null
          bvn_verified: boolean | null
          created_at: string
          customer_id: string | null
          id: string
          id_number: string | null
          id_type: string | null
          id_verified: boolean | null
          kyc_status: string | null
          kyc_tier: number | null
          last_reviewed_at: string | null
          missing_items: Json | null
          photo_verified: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_verified?: boolean | null
          bvn_verified?: boolean | null
          created_at?: string
          customer_id?: string | null
          id?: string
          id_number?: string | null
          id_type?: string | null
          id_verified?: boolean | null
          kyc_status?: string | null
          kyc_tier?: number | null
          last_reviewed_at?: string | null
          missing_items?: Json | null
          photo_verified?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_verified?: boolean | null
          bvn_verified?: boolean | null
          created_at?: string
          customer_id?: string | null
          id?: string
          id_number?: string | null
          id_type?: string | null
          id_verified?: boolean | null
          kyc_status?: string | null
          kyc_tier?: number | null
          last_reviewed_at?: string | null
          missing_items?: Json | null
          photo_verified?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_kyc_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          account_number: string | null
          address: string | null
          agent_notes: Json | null
          bvn: string | null
          created_at: string
          customer_segment: string | null
          date_of_birth: string | null
          email: string | null
          full_name: string
          id: string
          phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number?: string | null
          address?: string | null
          agent_notes?: Json | null
          bvn?: string | null
          created_at?: string
          customer_segment?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string | null
          address?: string | null
          agent_notes?: Json | null
          bvn?: string | null
          created_at?: string
          customer_segment?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone_number?: string | null
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
      filing_schedules: {
        Row: {
          created_at: string
          due_rule: string
          frequency: string
          id: string
          notes: string | null
          regulator: string
          return_type: string
          title: string
        }
        Insert: {
          created_at?: string
          due_rule: string
          frequency: string
          id?: string
          notes?: string | null
          regulator: string
          return_type: string
          title: string
        }
        Update: {
          created_at?: string
          due_rule?: string
          frequency?: string
          id?: string
          notes?: string | null
          regulator?: string
          return_type?: string
          title?: string
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
      institution_users: {
        Row: {
          admin_user_id: string
          created_at: string
          id: string
          invited_email: string
          invited_name: string | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          id?: string
          invited_email: string
          invited_name?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          id?: string
          invited_email?: string
          invited_name?: string | null
          role?: string
          status?: string
          updated_at?: string
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
      monthly_compliance_tasks: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          month: string
          notes: string | null
          priority: string | null
          priority_order: number | null
          recurring: boolean | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          month: string
          notes?: string | null
          priority?: string | null
          priority_order?: number | null
          recurring?: boolean | null
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          month?: string
          notes?: string | null
          priority?: string | null
          priority_order?: number | null
          recurring?: boolean | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      news_read_status: {
        Row: {
          id: string
          news_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          news_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          news_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_read_status_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "regulatory_news"
            referencedColumns: ["id"]
          },
        ]
      }
      pep_entries: {
        Row: {
          category: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string
          id: string
          position: string | null
          source: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name: string
          id?: string
          position?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id?: string
          position?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
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
          reporting_api_key: string | null
          tutorial_completed: boolean
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
          reporting_api_key?: string | null
          tutorial_completed?: boolean
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
          reporting_api_key?: string | null
          tutorial_completed?: boolean
        }
        Relationships: []
      }
      regulatory_news: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          fetched_at: string | null
          id: string
          image_url: string | null
          is_important: boolean | null
          is_read: boolean | null
          published_at: string | null
          source: string | null
          tags: string[] | null
          title: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          fetched_at?: string | null
          id?: string
          image_url?: string | null
          is_important?: boolean | null
          is_read?: boolean | null
          published_at?: string | null
          source?: string | null
          tags?: string[] | null
          title: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          fetched_at?: string | null
          id?: string
          image_url?: string | null
          is_important?: boolean | null
          is_read?: boolean | null
          published_at?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      regulatory_rules: {
        Row: {
          citation: string | null
          created_at: string
          description: string
          id: string
          regulator: string
          rule_code: string
          threshold: Json | null
          title: string
        }
        Insert: {
          citation?: string | null
          created_at?: string
          description: string
          id?: string
          regulator: string
          rule_code: string
          threshold?: Json | null
          title: string
        }
        Update: {
          citation?: string | null
          created_at?: string
          description?: string
          id?: string
          regulator?: string
          rule_code?: string
          threshold?: Json | null
          title?: string
        }
        Relationships: []
      }
      report_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          data_source_id: string | null
          form_data: Json
          formats: string[]
          id: string
          institution_name: string
          params: Json
          rc_number: string | null
          readiness: Json | null
          report_id: string | null
          report_type: string
          reporting_period_end: string
          reporting_period_start: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          data_source_id?: string | null
          form_data?: Json
          formats?: string[]
          id?: string
          institution_name: string
          params?: Json
          rc_number?: string | null
          readiness?: Json | null
          report_id?: string | null
          report_type: string
          reporting_period_end: string
          reporting_period_start: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          data_source_id?: string | null
          form_data?: Json
          formats?: string[]
          id?: string
          institution_name?: string
          params?: Json
          rc_number?: string | null
          readiness?: Json | null
          report_id?: string | null
          report_type?: string
          reporting_period_end?: string
          reporting_period_start?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_requests_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
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
          car_percentage: number | null
          content: string | null
          created_at: string
          csv_url: string | null
          docx_url: string | null
          error_message: string | null
          error_type: string | null
          file_path: string | null
          file_url: string | null
          generated_at: string | null
          id: string
          liquidity_percentage: number | null
          npl_ratio: number | null
          pdf_url: string | null
          period_end: string | null
          period_start: string | null
          regulator: string | null
          report_filename: string | null
          report_name: string
          report_type: string | null
          report_url: string | null
          reporting_period_end: string | null
          reporting_period_start: string | null
          return_type: string | null
          status: string
          user_id: string
          validation_passed: boolean | null
          xlsx_url: string | null
          xml_url: string | null
        }
        Insert: {
          car_percentage?: number | null
          content?: string | null
          created_at?: string
          csv_url?: string | null
          docx_url?: string | null
          error_message?: string | null
          error_type?: string | null
          file_path?: string | null
          file_url?: string | null
          generated_at?: string | null
          id?: string
          liquidity_percentage?: number | null
          npl_ratio?: number | null
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          regulator?: string | null
          report_filename?: string | null
          report_name: string
          report_type?: string | null
          report_url?: string | null
          reporting_period_end?: string | null
          reporting_period_start?: string | null
          return_type?: string | null
          status?: string
          user_id: string
          validation_passed?: boolean | null
          xlsx_url?: string | null
          xml_url?: string | null
        }
        Update: {
          car_percentage?: number | null
          content?: string | null
          created_at?: string
          csv_url?: string | null
          docx_url?: string | null
          error_message?: string | null
          error_type?: string | null
          file_path?: string | null
          file_url?: string | null
          generated_at?: string | null
          id?: string
          liquidity_percentage?: number | null
          npl_ratio?: number | null
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          regulator?: string | null
          report_filename?: string | null
          report_name?: string
          report_type?: string | null
          report_url?: string | null
          reporting_period_end?: string | null
          reporting_period_start?: string | null
          return_type?: string | null
          status?: string
          user_id?: string
          validation_passed?: boolean | null
          xlsx_url?: string | null
          xml_url?: string | null
        }
        Relationships: []
      }
      sanctions_entries: {
        Row: {
          active: boolean | null
          aliases: string | null
          country: string | null
          created_at: string
          date_listed: string | null
          date_of_birth: string | null
          entity_type: string | null
          full_name: string
          id: string
          last_updated: string | null
          list_name: string
          list_type: string | null
          nationality: string | null
          notes: string | null
          raw_data: Json | null
          reason: string | null
          source_url: string | null
        }
        Insert: {
          active?: boolean | null
          aliases?: string | null
          country?: string | null
          created_at?: string
          date_listed?: string | null
          date_of_birth?: string | null
          entity_type?: string | null
          full_name: string
          id?: string
          last_updated?: string | null
          list_name: string
          list_type?: string | null
          nationality?: string | null
          notes?: string | null
          raw_data?: Json | null
          reason?: string | null
          source_url?: string | null
        }
        Update: {
          active?: boolean | null
          aliases?: string | null
          country?: string | null
          created_at?: string
          date_listed?: string | null
          date_of_birth?: string | null
          entity_type?: string | null
          full_name?: string
          id?: string
          last_updated?: string | null
          list_name?: string
          list_type?: string | null
          nationality?: string | null
          notes?: string | null
          raw_data?: Json | null
          reason?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      sanctions_sync_log: {
        Row: {
          duration_ms: number | null
          error_message: string | null
          id: string
          list_name: string
          records_added: number | null
          records_updated: number | null
          status: string | null
          sync_date: string | null
          total_records: number | null
        }
        Insert: {
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          list_name: string
          records_added?: number | null
          records_updated?: number | null
          status?: string | null
          sync_date?: string | null
          total_records?: number | null
        }
        Update: {
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          list_name?: string
          records_added?: number | null
          records_updated?: number | null
          status?: string | null
          sync_date?: string | null
          total_records?: number | null
        }
        Relationships: []
      }
      screening_results: {
        Row: {
          action_taken: string | null
          created_at: string
          customer_id: string | null
          highest_risk: string
          id: string
          match_details: Json | null
          matches_found: number
          notes: string | null
          screened_by: string | null
          search_bvn: string | null
          search_date: string
          search_name: string
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          customer_id?: string | null
          highest_risk?: string
          id?: string
          match_details?: Json | null
          matches_found?: number
          notes?: string | null
          screened_by?: string | null
          search_bvn?: string | null
          search_date?: string
          search_name: string
          user_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          customer_id?: string | null
          highest_risk?: string
          id?: string
          match_details?: Json | null
          matches_found?: number
          notes?: string | null
          screened_by?: string | null
          search_bvn?: string | null
          search_date?: string
          search_name?: string
          user_id?: string
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
      transaction_reviews: {
        Row: {
          account_number: string | null
          amount: number | null
          case_number: string | null
          channel: string | null
          created_at: string
          customer_id: string | null
          customer_name: string | null
          flag_reason: string | null
          flag_severity: string | null
          flag_type: string | null
          id: string
          notes: string | null
          review_status: string | null
          status: string | null
          str_reference: string | null
          transaction_date: string
          upload_batch_id: string | null
          user_id: string
        }
        Insert: {
          account_number?: string | null
          amount?: number | null
          case_number?: string | null
          channel?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          flag_reason?: string | null
          flag_severity?: string | null
          flag_type?: string | null
          id?: string
          notes?: string | null
          review_status?: string | null
          status?: string | null
          str_reference?: string | null
          transaction_date?: string
          upload_batch_id?: string | null
          user_id: string
        }
        Update: {
          account_number?: string | null
          amount?: number | null
          case_number?: string | null
          channel?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          flag_reason?: string | null
          flag_severity?: string | null
          flag_type?: string | null
          id?: string
          notes?: string | null
          review_status?: string | null
          status?: string | null
          str_reference?: string | null
          transaction_date?: string
          upload_batch_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      unified_transactions: {
        Row: {
          account_number: string | null
          amount: number
          balance_after: number | null
          branch_code: string | null
          channel: string | null
          counterparty: string | null
          created_at: string
          currency: string | null
          customer_id: string | null
          customer_name: string | null
          description: string | null
          flag_reason: string | null
          flag_rule: string | null
          flag_severity: string | null
          id: string
          is_flagged: boolean
          narration: string | null
          reference: string | null
          review_notes: string | null
          review_status: string
          str_filed_at: string | null
          str_reference: string | null
          transaction_date: string
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          account_number?: string | null
          amount?: number
          balance_after?: number | null
          branch_code?: string | null
          channel?: string | null
          counterparty?: string | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          customer_name?: string | null
          description?: string | null
          flag_reason?: string | null
          flag_rule?: string | null
          flag_severity?: string | null
          id?: string
          is_flagged?: boolean
          narration?: string | null
          reference?: string | null
          review_notes?: string | null
          review_status?: string
          str_filed_at?: string | null
          str_reference?: string | null
          transaction_date?: string
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          account_number?: string | null
          amount?: number
          balance_after?: number | null
          branch_code?: string | null
          channel?: string | null
          counterparty?: string | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          customer_name?: string | null
          description?: string | null
          flag_reason?: string | null
          flag_rule?: string | null
          flag_severity?: string | null
          id?: string
          is_flagged?: boolean
          narration?: string | null
          reference?: string | null
          review_notes?: string | null
          review_status?: string
          str_filed_at?: string | null
          str_reference?: string | null
          transaction_date?: string
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unified_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
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
      webhook_api_keys: {
        Row: {
          active: boolean
          created_at: string
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
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
