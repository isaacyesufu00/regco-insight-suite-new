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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_actions: {
        Row: {
          account_number_hash: string
          action: string
          approved_at: string | null
          approved_by: string | null
          case_id: string | null
          created_at: string
          id: string
          institution_id: string
          reason: string | null
          requested_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number_hash: string
          action: string
          approved_at?: string | null
          approved_by?: string | null
          case_id?: string | null
          created_at?: string
          id?: string
          institution_id: string
          reason?: string | null
          requested_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number_hash?: string
          action?: string
          approved_at?: string | null
          approved_by?: string | null
          case_id?: string | null
          created_at?: string
          id?: string
          institution_id?: string
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
          {
            foreignKeyName: "account_actions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["case_id"]
          },
        ]
      }
      accounts: {
        Row: {
          account_type: string
          balance: number
          created_at: string
          customer_id: string
          id: string
          institution_id: string
        }
        Insert: {
          account_type: string
          balance?: number
          created_at?: string
          customer_id: string
          id?: string
          institution_id?: string
        }
        Update: {
          account_type?: string
          balance?: number
          created_at?: string
          customer_id?: string
          id?: string
          institution_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      adverse_media_cache: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          institution_id: string
          query: string
          query_hash: string
          result: Json
          years: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          institution_id: string
          query: string
          query_hash: string
          result: Json
          years: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          institution_id?: string
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
          institution_id: string
          title_hash: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          institution_id: string
          title_hash?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          institution_id?: string
          title_hash?: string
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
          content_hash: string
          conversation_id: string
          created_at: string
          id: string
          institution_id: string
          parts: Json | null
          role: string
          user_id: string
        }
        Insert: {
          action_payload?: Json | null
          action_type?: string | null
          content_hash?: string
          conversation_id: string
          created_at?: string
          id?: string
          institution_id: string
          parts?: Json | null
          role: string
          user_id: string
        }
        Update: {
          action_payload?: Json | null
          action_type?: string | null
          content_hash?: string
          conversation_id?: string
          created_at?: string
          id?: string
          institution_id?: string
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
          args_hash: Json | null
          conversation_id: string | null
          created_at: string
          error: string | null
          id: string
          institution_id: string
          latency_ms: number | null
          message_id: string | null
          result_summary_hash: string | null
          status: string
          tool_name: string
          user_id: string
        }
        Insert: {
          args_hash?: Json | null
          conversation_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          institution_id: string
          latency_ms?: number | null
          message_id?: string | null
          result_summary_hash?: string | null
          status?: string
          tool_name: string
          user_id: string
        }
        Update: {
          args_hash?: Json | null
          conversation_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          institution_id?: string
          latency_ms?: number | null
          message_id?: string | null
          result_summary_hash?: string | null
          status?: string
          tool_name?: string
          user_id?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          assigned_to: string | null
          checker_comment: string | null
          checker_id: string | null
          created_at: string | null
          id: string
          institution_id: string
          maker_comment: string | null
          maker_id: string | null
          rule_id: string | null
          severity: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          checker_comment?: string | null
          checker_id?: string | null
          created_at?: string | null
          id?: string
          institution_id: string
          maker_comment?: string | null
          maker_id?: string | null
          rule_id?: string | null
          severity?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          checker_comment?: string | null
          checker_id?: string | null
          created_at?: string | null
          id?: string
          institution_id?: string
          maker_comment?: string | null
          maker_id?: string | null
          rule_id?: string | null
          severity?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      aml_alert_status_history: {
        Row: {
          alert_id: string
          changed_at: string
          changed_by: string | null
          from_status: string | null
          id: string
          to_status: string
        }
        Insert: {
          alert_id: string
          changed_at?: string
          changed_by?: string | null
          from_status?: string | null
          id?: string
          to_status: string
        }
        Update: {
          alert_id?: string
          changed_at?: string
          changed_by?: string | null
          from_status?: string | null
          id?: string
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "aml_alert_status_history_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "aml_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aml_alert_status_history_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["alert_id"]
          },
        ]
      }
      aml_alerts: {
        Row: {
          created_at: string | null
          customer_id: string
          evidence: Json
          id: string
          institution_id: string
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          rule_id: string
          score: number
          severity: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          evidence?: Json
          id?: string
          institution_id: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rule_id: string
          score?: number
          severity: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          evidence?: Json
          id?: string
          institution_id?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rule_id?: string
          score?: number
          severity?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aml_alerts_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aml_alerts_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "aml_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aml_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "monitored_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aml_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "v_ctr_due"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      aml_decisions: {
        Row: {
          created_at: string
          decision: string
          id: string
          institution_id: string
          justification: Json
          source_document_ids: string[]
          transaction_id: string
        }
        Insert: {
          created_at?: string
          decision: string
          id?: string
          institution_id: string
          justification?: Json
          source_document_ids?: string[]
          transaction_id: string
        }
        Update: {
          created_at?: string
          decision?: string
          id?: string
          institution_id?: string
          justification?: Json
          source_document_ids?: string[]
          transaction_id?: string
        }
        Relationships: []
      }
      aml_jobs: {
        Row: {
          created_at: string
          error_log: Json | null
          id: string
          institution_id: string
          payload_size_kb: number | null
          processed_count: number | null
          status: Database["public"]["Enums"]["aml_job_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_log?: Json | null
          id?: string
          institution_id?: string
          payload_size_kb?: number | null
          processed_count?: number | null
          status?: Database["public"]["Enums"]["aml_job_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_log?: Json | null
          id?: string
          institution_id?: string
          payload_size_kb?: number | null
          processed_count?: number | null
          status?: Database["public"]["Enums"]["aml_job_status"]
          updated_at?: string
        }
        Relationships: []
      }
      aml_review_events: {
        Row: {
          alert_id: string
          changed_at: string | null
          changed_by: string | null
          id: string
          institution_id: string
          new_status: string
          note: string | null
          old_status: string
        }
        Insert: {
          alert_id: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          institution_id: string
          new_status: string
          note?: string | null
          old_status: string
        }
        Update: {
          alert_id?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          institution_id?: string
          new_status?: string
          note?: string | null
          old_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "aml_review_events_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "aml_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aml_review_events_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["alert_id"]
          },
        ]
      }
      aml_rules: {
        Row: {
          created_at: string | null
          id: string
          institution_id: string
          is_active: boolean
          name: string
          rule_code: string
          rule_type: string
          severity: string | null
          threshold: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          institution_id: string
          is_active?: boolean
          name: string
          rule_code: string
          rule_type: string
          severity?: string | null
          threshold?: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          institution_id?: string
          is_active?: boolean
          name?: string
          rule_code?: string
          rule_type?: string
          severity?: string | null
          threshold?: Json
        }
        Relationships: [
          {
            foreignKeyName: "aml_rules_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_issues: {
        Row: {
          category: string | null
          closed_date: string | null
          created_at: string | null
          description_hash: string | null
          due_date: string | null
          evidence_notes_hash: string | null
          examination_date: string | null
          id: string
          institution_id: string
          issue_ref: string | null
          owner_email_hash: string | null
          owner_name_hash: string | null
          regulator: string | null
          remediation_plan_hash: string | null
          severity: string | null
          source: string
          status: string | null
          title_hash: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          closed_date?: string | null
          created_at?: string | null
          description_hash?: string | null
          due_date?: string | null
          evidence_notes_hash?: string | null
          examination_date?: string | null
          id?: string
          institution_id: string
          issue_ref?: string | null
          owner_email_hash?: string | null
          owner_name_hash?: string | null
          regulator?: string | null
          remediation_plan_hash?: string | null
          severity?: string | null
          source: string
          status?: string | null
          title_hash: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          closed_date?: string | null
          created_at?: string | null
          description_hash?: string | null
          due_date?: string | null
          evidence_notes_hash?: string | null
          examination_date?: string | null
          id?: string
          institution_id?: string
          issue_ref?: string | null
          owner_email_hash?: string | null
          owner_name_hash?: string | null
          regulator?: string | null
          remediation_plan_hash?: string | null
          severity?: string | null
          source?: string
          status?: string | null
          title_hash?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          args_hash: string | null
          created_at: string
          id: string
          institution_id: string
          record_id: string | null
          result_summary_hash: string | null
          table_name: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          args_hash?: string | null
          created_at?: string
          id?: string
          institution_id: string
          record_id?: string | null
          result_summary_hash?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          args_hash?: string | null
          created_at?: string
          id?: string
          institution_id?: string
          record_id?: string | null
          result_summary_hash?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          curr_hash: string
          entity: string
          entity_id: string | null
          id: string
          payload: Json
          prev_hash: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          curr_hash: string
          entity: string
          entity_id?: string | null
          id?: string
          payload: Json
          prev_hash: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          curr_hash?: string
          entity?: string
          entity_id?: string | null
          id?: string
          payload?: Json
          prev_hash?: string
          user_id?: string | null
        }
        Relationships: []
      }
      audit_trail: {
        Row: {
          action: string
          actor_id: string | null
          alert_id: string
          created_at: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          alert_id: string
          created_at?: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          alert_id?: string
          created_at?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "audit_trail_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      case_alerts: {
        Row: {
          alert_id: string
          case_id: string
        }
        Insert: {
          alert_id: string
          case_id: string
        }
        Update: {
          alert_id?: string
          case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_alerts_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "aml_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_alerts_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["alert_id"]
          },
          {
            foreignKeyName: "case_alerts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_alerts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["case_id"]
          },
        ]
      }
      case_artifacts: {
        Row: {
          body_hash: string | null
          case_id: string
          created_at: string
          id: string
          institution_id: string
          kind: string
          metadata: Json | null
          storage_path: string | null
          title_hash: string
          user_id: string
        }
        Insert: {
          body_hash?: string | null
          case_id: string
          created_at?: string
          id?: string
          institution_id: string
          kind: string
          metadata?: Json | null
          storage_path?: string | null
          title_hash: string
          user_id: string
        }
        Update: {
          body_hash?: string | null
          case_id?: string
          created_at?: string
          id?: string
          institution_id?: string
          kind?: string
          metadata?: Json | null
          storage_path?: string | null
          title_hash?: string
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
          {
            foreignKeyName: "case_artifacts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["case_id"]
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
          institution_id: string
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
          institution_id: string
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
          institution_id?: string
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
          {
            foreignKeyName: "case_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["case_id"]
          },
        ]
      }
      case_status_history: {
        Row: {
          case_id: string
          changed_at: string
          changed_by: string | null
          from_status: string | null
          id: string
          note: string | null
          to_status: string
        }
        Insert: {
          case_id: string
          changed_at?: string
          changed_by?: string | null
          from_status?: string | null
          id?: string
          note?: string | null
          to_status: string
        }
        Update: {
          case_id?: string
          changed_at?: string
          changed_by?: string | null
          from_status?: string | null
          id?: string
          note?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_status_history_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_status_history_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["case_id"]
          },
        ]
      }
      cases: {
        Row: {
          assignee_id: string | null
          close_reason: string | null
          closed_at: string | null
          closed_by: string | null
          created_at: string
          customer_id: string | null
          id: string
          institution_id: string
          opened_at: string
          severity: string
          sla_due_at: string | null
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
          close_reason?: string | null
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          institution_id: string
          opened_at?: string
          severity?: string
          sla_due_at?: string | null
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
          close_reason?: string | null
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          institution_id?: string
          opened_at?: string
          severity?: string
          sla_due_at?: string | null
          status?: string
          summary?: string | null
          title?: string
          trigger_id?: string | null
          trigger_kind?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compiled_returns: {
        Row: {
          created_at: string
          error_log: Json | null
          id: string
          institution_id: string
          raw_xml: string | null
          record_count: number | null
          reporting_period_end: string
          reporting_period_start: string
          status: string
          submitted_at: string | null
          template_id: string
        }
        Insert: {
          created_at?: string
          error_log?: Json | null
          id?: string
          institution_id?: string
          raw_xml?: string | null
          record_count?: number | null
          reporting_period_end: string
          reporting_period_start: string
          status?: string
          submitted_at?: string | null
          template_id: string
        }
        Update: {
          created_at?: string
          error_log?: Json | null
          id?: string
          institution_id?: string
          raw_xml?: string | null
          record_count?: number | null
          reporting_period_end?: string
          reporting_period_start?: string
          status?: string
          submitted_at?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_institution_return"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_template"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "return_templates"
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
          institution_id: string | null
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
          institution_id?: string | null
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
          institution_id?: string | null
          metrics?: Json | null
          month?: string
          report_type?: string | null
          status?: string | null
          storage_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_reports_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_rules: {
        Row: {
          corporate_ctr_threshold: number | null
          individual_ctr_threshold: number | null
          institution_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          corporate_ctr_threshold?: number | null
          individual_ctr_threshold?: number | null
          institution_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          corporate_ctr_threshold?: number | null
          individual_ctr_threshold?: number | null
          institution_id?: string
          updated_at?: string | null
          updated_by?: string | null
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
      ctr_flagged_transactions: {
        Row: {
          account_number_hash: string | null
          amount: number | null
          bvn_hash: string | null
          created_at: string | null
          customer_id: string | null
          customer_segment: string | null
          entity_type: string
          flag_reason: string | null
          id: string
          institution_id: string
          phone_hash: string | null
          status: string
          transaction_id: string | null
        }
        Insert: {
          account_number_hash?: string | null
          amount?: number | null
          bvn_hash?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_segment?: string | null
          entity_type?: string
          flag_reason?: string | null
          id?: string
          institution_id: string
          phone_hash?: string | null
          status?: string
          transaction_id?: string | null
        }
        Update: {
          account_number_hash?: string | null
          amount?: number | null
          bvn_hash?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_segment?: string | null
          entity_type?: string
          flag_reason?: string | null
          id?: string
          institution_id?: string
          phone_hash?: string | null
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ctr_flagged_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ctr_flagged_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_accounts: {
        Row: {
          account_number: string | null
          account_number_hash: string
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
          account_number?: string | null
          account_number_hash: string
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
          account_number?: string | null
          account_number_hash?: string
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
        Relationships: []
      }
      customer_beneficial_owners: {
        Row: {
          bvn_hash: string | null
          created_at: string
          customer_id: string
          id: string
          is_25pct_controller: boolean | null
          owner_name: string
          ownership_pct: number
          screening_matches: Json
          screening_risk_level: string
          screening_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bvn_hash?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_25pct_controller?: boolean | null
          owner_name: string
          ownership_pct: number
          screening_matches?: Json
          screening_risk_level?: string
          screening_status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          bvn_hash?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_25pct_controller?: boolean | null
          owner_name?: string
          ownership_pct?: number
          screening_matches?: Json
          screening_risk_level?: string
          screening_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_beneficial_owners_customer_id_fkey"
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
        Relationships: []
      }
      customers: {
        Row: {
          account_number_hash: string
          bvn_hash: string | null
          bvn_verified: boolean
          bvn_verified_at: string | null
          created_at: string | null
          customer_segment: string
          dob: string | null
          email_hash: string | null
          full_name_hash: string
          id: string
          institution_id: string
          kyc_attempts: number
          kyc_status: string
          locked_until: string | null
          phone_hash: string | null
          pii_migration_reviewed: boolean
        }
        Insert: {
          account_number_hash: string
          bvn_hash?: string | null
          bvn_verified?: boolean
          bvn_verified_at?: string | null
          created_at?: string | null
          customer_segment: string
          dob?: string | null
          email_hash?: string | null
          full_name_hash: string
          id?: string
          institution_id: string
          kyc_attempts?: number
          kyc_status?: string
          locked_until?: string | null
          phone_hash?: string | null
          pii_migration_reviewed?: boolean
        }
        Update: {
          account_number_hash?: string
          bvn_hash?: string | null
          bvn_verified?: boolean
          bvn_verified_at?: string | null
          created_at?: string | null
          customer_segment?: string
          dob?: string | null
          email_hash?: string | null
          full_name_hash?: string
          id?: string
          institution_id?: string
          kyc_attempts?: number
          kyc_status?: string
          locked_until?: string | null
          phone_hash?: string | null
          pii_migration_reviewed?: boolean
        }
        Relationships: []
      }
      data_retention_jobs: {
        Row: {
          created_at: string | null
          id: string
          institution_id: string
          last_run_at: string | null
          retention_policy_days: number | null
          status: string | null
          target_table: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          institution_id: string
          last_run_at?: string | null
          retention_policy_days?: number | null
          status?: string | null
          target_table: string
        }
        Update: {
          created_at?: string | null
          id?: string
          institution_id?: string
          last_run_at?: string | null
          retention_policy_days?: number | null
          status?: string | null
          target_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_retention_jobs_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
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
          company_name_hash: string | null
          created_at: string
          email_hash: string | null
          full_name_hash: string | null
          id: string
          message: string | null
          phone_hash: string | null
          report_type: string | null
        }
        Insert: {
          company_name_hash?: string | null
          created_at?: string
          email_hash?: string | null
          full_name_hash?: string | null
          id?: string
          message?: string | null
          phone_hash?: string | null
          report_type?: string | null
        }
        Update: {
          company_name_hash?: string | null
          created_at?: string
          email_hash?: string | null
          full_name_hash?: string | null
          id?: string
          message?: string | null
          phone_hash?: string | null
          report_type?: string | null
        }
        Relationships: []
      }
      document_storage: {
        Row: {
          created_at: string | null
          document_id: string | null
          encryption_key_id: string | null
          id: string
          institution_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          encryption_key_id?: string | null
          id?: string
          institution_id: string
          storage_path: string
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          encryption_key_id?: string | null
          id?: string
          institution_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_storage_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_storage_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          customer_id: string | null
          document_type: string
          id: string
          institution_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          document_type: string
          id?: string
          institution_id: string
          status: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          document_type?: string
          id?: string
          institution_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
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
      eod_reconciliation: {
        Row: {
          created_at: string
          ctr_generated: number
          details: Json
          exceptions_count: number
          id: string
          institution_id: string
          recon_date: string
          status: string
          str_due: number
          total_amount: number
          total_transactions: number
        }
        Insert: {
          created_at?: string
          ctr_generated?: number
          details?: Json
          exceptions_count?: number
          id?: string
          institution_id: string
          recon_date: string
          status: string
          str_due?: number
          total_amount: number
          total_transactions: number
        }
        Update: {
          created_at?: string
          ctr_generated?: number
          details?: Json
          exceptions_count?: number
          id?: string
          institution_id?: string
          recon_date?: string
          status?: string
          str_due?: number
          total_amount?: number
          total_transactions?: number
        }
        Relationships: [
          {
            foreignKeyName: "eod_reconciliation_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
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
      fraud_alerts: {
        Row: {
          created_at: string | null
          customer_id: string
          evidence: Json
          id: string
          institution_id: string
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          rule_id: string
          score: number
          severity: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          evidence?: Json
          id?: string
          institution_id: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rule_id: string
          score?: number
          severity: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          evidence?: Json
          id?: string
          institution_id?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rule_id?: string
          score?: number
          severity?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_alerts_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "fraud_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "monitored_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "v_ctr_due"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      fraud_review_events: {
        Row: {
          alert_id: string
          changed_at: string | null
          changed_by: string | null
          id: string
          institution_id: string
          new_status: string
          note: string | null
          old_status: string
        }
        Insert: {
          alert_id: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          institution_id: string
          new_status: string
          note?: string | null
          old_status: string
        }
        Update: {
          alert_id?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          institution_id?: string
          new_status?: string
          note?: string | null
          old_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_review_events_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "fraud_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_rules: {
        Row: {
          created_at: string | null
          id: string
          institution_id: string
          is_active: boolean
          name: string
          rule_code: string
          rule_type: string
          severity: string
          threshold: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          institution_id: string
          is_active?: boolean
          name: string
          rule_code: string
          rule_type: string
          severity?: string
          threshold?: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          institution_id?: string
          is_active?: boolean
          name?: string
          rule_code?: string
          rule_type?: string
          severity?: string
          threshold?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fraud_rules_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_signals: {
        Row: {
          ai_model_id: string | null
          ai_reviewed_at: string | null
          ai_status: string | null
          created_at: string
          details: Json
          id: string
          institution_id: string
          reasoning: string | null
          recommended_action: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_score: number | null
          severity: string
          signal_type: string
          status: string
          transaction_id: string
        }
        Insert: {
          ai_model_id?: string | null
          ai_reviewed_at?: string | null
          ai_status?: string | null
          created_at?: string
          details?: Json
          id?: string
          institution_id: string
          reasoning?: string | null
          recommended_action?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_score?: number | null
          severity?: string
          signal_type: string
          status?: string
          transaction_id: string
        }
        Update: {
          ai_model_id?: string | null
          ai_reviewed_at?: string | null
          ai_status?: string | null
          created_at?: string
          details?: Json
          id?: string
          institution_id?: string
          reasoning?: string | null
          recommended_action?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_score?: number | null
          severity?: string
          signal_type?: string
          status?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_signals_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      goaml_exports: {
        Row: {
          created_at: string
          generated_by: string | null
          id: string
          institution_id: string
          period_end: string
          period_start: string
          raw_xml: string
          record_count: number
          report_type: string
          status: string
          submitted_at: string | null
          xml_sha256: string
        }
        Insert: {
          created_at?: string
          generated_by?: string | null
          id?: string
          institution_id: string
          period_end: string
          period_start: string
          raw_xml: string
          record_count?: number
          report_type: string
          status?: string
          submitted_at?: string | null
          xml_sha256: string
        }
        Update: {
          created_at?: string
          generated_by?: string | null
          id?: string
          institution_id?: string
          period_end?: string
          period_start?: string
          raw_xml?: string
          record_count?: number
          report_type?: string
          status?: string
          submitted_at?: string | null
          xml_sha256?: string
        }
        Relationships: [
          {
            foreignKeyName: "goaml_exports_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_review_events: {
        Row: {
          change_reason: string
          changed_at: string
          changed_by: string | null
          id: string
          institution_id: string
          metadata: Json
          new_status: string
          old_status: string
          screening_id: string
        }
        Insert: {
          change_reason: string
          changed_at?: string
          changed_by?: string | null
          id?: string
          institution_id: string
          metadata?: Json
          new_status: string
          old_status: string
          screening_id: string
        }
        Update: {
          change_reason?: string
          changed_at?: string
          changed_by?: string | null
          id?: string
          institution_id?: string
          metadata?: Json
          new_status?: string
          old_status?: string
          screening_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identity_review_events_screening_id_fkey"
            columns: ["screening_id"]
            isOneToOne: false
            referencedRelation: "identity_screening"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_screening: {
        Row: {
          checks_requested: string[] | null
          created_at: string
          customer_id: string | null
          duplicate_of: string | null
          id: string
          institution_id: string
          metadata: Json
          provider: string | null
          provider_payload: Json | null
          provider_reference: string | null
          provider_status: string | null
          result_status: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_score: number | null
          rule_code: string | null
          score: number
          screening_source: string
          screening_type: string
          subject_hash: string
          subject_type: string
          updated_at: string
          verification_url: string | null
        }
        Insert: {
          checks_requested?: string[] | null
          created_at?: string
          customer_id?: string | null
          duplicate_of?: string | null
          id?: string
          institution_id: string
          metadata?: Json
          provider?: string | null
          provider_payload?: Json | null
          provider_reference?: string | null
          provider_status?: string | null
          result_status?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_score?: number | null
          rule_code?: string | null
          score?: number
          screening_source: string
          screening_type: string
          subject_hash: string
          subject_type: string
          updated_at?: string
          verification_url?: string | null
        }
        Update: {
          checks_requested?: string[] | null
          created_at?: string
          customer_id?: string | null
          duplicate_of?: string | null
          id?: string
          institution_id?: string
          metadata?: Json
          provider?: string | null
          provider_payload?: Json | null
          provider_reference?: string | null
          provider_status?: string | null
          result_status?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_score?: number | null
          rule_code?: string | null
          score?: number
          screening_source?: string
          screening_type?: string
          subject_hash?: string
          subject_type?: string
          updated_at?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "identity_screening_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "identity_screening_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "identity_screening"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "identity_screening_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_kyc_configs: {
        Row: {
          created_at: string | null
          dojah_app_id_enc: string | null
          dojah_secret_enc: string | null
          institution_id: string
          is_active: boolean
          provider: string
          smile_api_key_enc: string | null
          smile_partner_id_enc: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dojah_app_id_enc?: string | null
          dojah_secret_enc?: string | null
          institution_id: string
          is_active?: boolean
          provider: string
          smile_api_key_enc?: string | null
          smile_partner_id_enc?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dojah_app_id_enc?: string | null
          dojah_secret_enc?: string | null
          institution_id?: string
          is_active?: boolean
          provider?: string
          smile_api_key_enc?: string | null
          smile_partner_id_enc?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institution_kyc_configs_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: true
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
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
          created_at: string
          id: string
          institution_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          institution_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          institution_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "institution_users_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          cbn_code: string | null
          compliance_email: string | null
          created_at: string
          id: string
          is_active: boolean | null
          license_type: string | null
          metadata: Json | null
          name: string
          ndpa_residency_verified: boolean | null
          rc_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cbn_code?: string | null
          compliance_email?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          license_type?: string | null
          metadata?: Json | null
          name: string
          ndpa_residency_verified?: boolean | null
          rc_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cbn_code?: string | null
          compliance_email?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          license_type?: string | null
          metadata?: Json | null
          name?: string
          ndpa_residency_verified?: boolean | null
          rc_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      integration_events: {
        Row: {
          created_at: string | null
          event_payload: Json | null
          id: string
          institution_id: string
          integration_name: string | null
        }
        Insert: {
          created_at?: string | null
          event_payload?: Json | null
          id?: string
          institution_id: string
          integration_name?: string | null
        }
        Update: {
          created_at?: string | null
          event_payload?: Json | null
          id?: string
          institution_id?: string
          integration_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_events_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          chunk_index: number | null
          cleaned_content: string | null
          content: string
          content_hash: string | null
          created_at: string | null
          document_title: string | null
          document_type: string | null
          embedding: string | null
          embedding_model: string | null
          id: string
          ingested_at: string | null
          jurisdiction: string | null
          metadata: Json | null
          needs_reembed: boolean | null
          publication_date: string | null
          regulator: string | null
          section_heading: string | null
          source_name: string | null
          source_url: string | null
        }
        Insert: {
          chunk_index?: number | null
          cleaned_content?: string | null
          content: string
          content_hash?: string | null
          created_at?: string | null
          document_title?: string | null
          document_type?: string | null
          embedding?: string | null
          embedding_model?: string | null
          id?: string
          ingested_at?: string | null
          jurisdiction?: string | null
          metadata?: Json | null
          needs_reembed?: boolean | null
          publication_date?: string | null
          regulator?: string | null
          section_heading?: string | null
          source_name?: string | null
          source_url?: string | null
        }
        Update: {
          chunk_index?: number | null
          cleaned_content?: string | null
          content?: string
          content_hash?: string | null
          created_at?: string | null
          document_title?: string | null
          document_type?: string | null
          embedding?: string | null
          embedding_model?: string | null
          id?: string
          ingested_at?: string | null
          jurisdiction?: string | null
          metadata?: Json | null
          needs_reembed?: boolean | null
          publication_date?: string | null
          regulator?: string | null
          section_heading?: string | null
          source_name?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      kyc_attempts: {
        Row: {
          check_type: string
          created_at: string | null
          id: string
          institution_id: string
          provider: string
          request_payload: Json | null
          response_payload: Json | null
          screening_id: string
          status: string
        }
        Insert: {
          check_type: string
          created_at?: string | null
          id?: string
          institution_id: string
          provider: string
          request_payload?: Json | null
          response_payload?: Json | null
          screening_id: string
          status: string
        }
        Update: {
          check_type?: string
          created_at?: string | null
          id?: string
          institution_id?: string
          provider?: string
          request_payload?: Json | null
          response_payload?: Json | null
          screening_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_attempts_screening_id_fkey"
            columns: ["screening_id"]
            isOneToOne: false
            referencedRelation: "identity_screening"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_provider_config: {
        Row: {
          created_at: string | null
          dojah_app_id: string | null
          dojah_secret_key_encrypted: string | null
          enabled_checks: string[] | null
          fallback_provider: string
          institution_id: string
          primary_provider: string
          smile_api_key_encrypted: string | null
          smile_partner_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dojah_app_id?: string | null
          dojah_secret_key_encrypted?: string | null
          enabled_checks?: string[] | null
          fallback_provider?: string
          institution_id: string
          primary_provider?: string
          smile_api_key_encrypted?: string | null
          smile_partner_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dojah_app_id?: string | null
          dojah_secret_key_encrypted?: string | null
          enabled_checks?: string[] | null
          fallback_provider?: string
          institution_id?: string
          primary_provider?: string
          smile_api_key_encrypted?: string | null
          smile_partner_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_provider_config_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: true
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_records: {
        Row: {
          address_verified: boolean | null
          bvn_verified: boolean | null
          created_at: string | null
          customer_id: string | null
          id: string
          id_verified: boolean | null
          institution_id: string
          kyc_status: string
          missing_items: string[] | null
          photo_verified: boolean | null
        }
        Insert: {
          address_verified?: boolean | null
          bvn_verified?: boolean | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          id_verified?: boolean | null
          institution_id: string
          kyc_status: string
          missing_items?: string[] | null
          photo_verified?: boolean | null
        }
        Update: {
          address_verified?: boolean | null
          bvn_verified?: boolean | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          id_verified?: boolean | null
          institution_id?: string
          kyc_status?: string
          missing_items?: string[] | null
          photo_verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_records_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_sessions: {
        Row: {
          completed_at: string | null
          customer_id: string | null
          id: string
          institution_id: string
          provider: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          customer_id?: string | null
          id?: string
          institution_id: string
          provider?: string | null
          started_at?: string | null
          status: string
        }
        Update: {
          completed_at?: string | null
          customer_id?: string | null
          id?: string
          institution_id?: string
          provider?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_sessions_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_verifications: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          institution_id: string
          match_score: number | null
          provider: string
          provider_ref: string | null
          request_hash: string
          response_encrypted: string | null
          status: string
          verification_type: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          institution_id: string
          match_score?: number | null
          provider: string
          provider_ref?: string | null
          request_hash: string
          response_encrypted?: string | null
          status: string
          verification_type: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          institution_id?: string
          match_score?: number | null
          provider?: string
          provider_ref?: string | null
          request_hash?: string
          response_encrypted?: string | null
          status?: string
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_kyc_cust"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_kyc_inst"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          attempt_count: number
          email_hash: string | null
          id: string
          last_attempt_at: string | null
          locked_until: string | null
        }
        Insert: {
          attempt_count?: number
          email_hash?: string | null
          id?: string
          last_attempt_at?: string | null
          locked_until?: string | null
        }
        Update: {
          attempt_count?: number
          email_hash?: string | null
          id?: string
          last_attempt_at?: string | null
          locked_until?: string | null
        }
        Relationships: []
      }
      monitored_transactions: {
        Row: {
          amount: number
          channel: string
          counterparty_account: string | null
          counterparty_name: string | null
          created_at: string | null
          currency: string
          customer_id: string
          device_id: string | null
          direction: string
          external_ref: string
          geo_city: string | null
          geo_country: string | null
          id: string
          institution_id: string
          ip_address: string | null
          occurred_at: string
          risk_score_at_time: number | null
        }
        Insert: {
          amount: number
          channel: string
          counterparty_account?: string | null
          counterparty_name?: string | null
          created_at?: string | null
          currency?: string
          customer_id: string
          device_id?: string | null
          direction: string
          external_ref: string
          geo_city?: string | null
          geo_country?: string | null
          id?: string
          institution_id: string
          ip_address?: string | null
          occurred_at?: string
          risk_score_at_time?: number | null
        }
        Update: {
          amount?: number
          channel?: string
          counterparty_account?: string | null
          counterparty_name?: string | null
          created_at?: string | null
          currency?: string
          customer_id?: string
          device_id?: string | null
          direction?: string
          external_ref?: string
          geo_city?: string | null
          geo_country?: string | null
          id?: string
          institution_id?: string
          ip_address?: string | null
          occurred_at?: string
          risk_score_at_time?: number | null
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
      nfiu_reports: {
        Row: {
          case_id: string
          created_at: string
          filed_at: string | null
          id: string
          report_type: string
          status: string
          updated_at: string
          user_id: string
          xml_content: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          filed_at?: string | null
          id?: string
          report_type: string
          status?: string
          updated_at?: string
          user_id?: string
          xml_content?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          filed_at?: string | null
          id?: string
          report_type?: string
          status?: string
          updated_at?: string
          user_id?: string
          xml_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nfiu_reports_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfiu_reports_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["case_id"]
          },
        ]
      }
      pending_submissions: {
        Row: {
          amountNGN: number
          caseId: string
          createdAt: string
          flagRule: string
          flagSeverity: string
          institutionId: string
          narrative: string | null
          owlScore: number
          status: string
          transactionDate: string
        }
        Insert: {
          amountNGN: number
          caseId: string
          createdAt: string
          flagRule: string
          flagSeverity: string
          institutionId: string
          narrative?: string | null
          owlScore: number
          status?: string
          transactionDate: string
        }
        Update: {
          amountNGN?: number
          caseId?: string
          createdAt?: string
          flagRule?: string
          flagSeverity?: string
          institutionId?: string
          narrative?: string | null
          owlScore?: number
          status?: string
          transactionDate?: string
        }
        Relationships: []
      }
      pep_entries: {
        Row: {
          category: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          full_name_hash: string | null
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
          full_name_hash?: string | null
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
          full_name_hash?: string | null
          id?: string
          position?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pep_screen_results: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          institution_id: string
          match_found: boolean | null
          pep_level: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          institution_id: string
          match_found?: boolean | null
          pep_level?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          institution_id?: string
          match_found?: boolean | null
          pep_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pep_screen_results_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pep_screen_results_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: string
          cbn_license_category: string | null
          company_name_hash: string | null
          compliance_lead_name_hash: string | null
          created_at: string
          full_name_hash: string | null
          id: string
          notification_email_report_ready: boolean
          phone_hash: string | null
          rc_number: string | null
          reporting_api_key: string | null
          tutorial_completed: boolean
        }
        Insert: {
          account_status?: string
          cbn_license_category?: string | null
          company_name_hash?: string | null
          compliance_lead_name_hash?: string | null
          created_at?: string
          full_name_hash?: string | null
          id: string
          notification_email_report_ready?: boolean
          phone_hash?: string | null
          rc_number?: string | null
          reporting_api_key?: string | null
          tutorial_completed?: boolean
        }
        Update: {
          account_status?: string
          cbn_license_category?: string | null
          company_name_hash?: string | null
          compliance_lead_name_hash?: string | null
          created_at?: string
          full_name_hash?: string | null
          id?: string
          notification_email_report_ready?: boolean
          phone_hash?: string | null
          rc_number?: string | null
          reporting_api_key?: string | null
          tutorial_completed?: boolean
        }
        Relationships: []
      }
      queue_jobs: {
        Row: {
          args_hash: string | null
          attempts: number | null
          created_at: string | null
          error: string | null
          id: string
          institution_id: string
          job_type: string
          path: string | null
          payload: Json | null
          result: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          args_hash?: string | null
          attempts?: number | null
          created_at?: string | null
          error?: string | null
          id?: string
          institution_id: string
          job_type?: string
          path?: string | null
          payload?: Json | null
          result?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          args_hash?: string | null
          attempts?: number | null
          created_at?: string | null
          error?: string | null
          id?: string
          institution_id?: string
          job_type?: string
          path?: string | null
          payload?: Json | null
          result?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "queue_jobs_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      receive_transaction_requests: {
        Row: {
          created_at: string
          id: string
          idempotency_key: string
          institution_id: string
          raw_payload: Json
          request_signature: string
          transaction_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          idempotency_key: string
          institution_id: string
          raw_payload: Json
          request_signature: string
          transaction_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          idempotency_key?: string
          institution_id?: string
          raw_payload?: Json
          request_signature?: string
          transaction_id?: string | null
        }
        Relationships: []
      }
      cbs_feed_connections: {
        Row: {
          id: string
          institution_id: string
          user_id: string
          feed_type: string
          label: string
          connection_secret_enc: string | null
          endpoint: string | null
          query: string | null
          schedule: string
          enabled: boolean
          last_synced_at: string | null
          last_status: string | null
          last_error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          institution_id: string
          user_id: string
          feed_type: string
          label: string
          connection_secret_enc?: string | null
          endpoint?: string | null
          query?: string | null
          schedule?: string
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          institution_id?: string
          user_id?: string
          feed_type?: string
          label?: string
          connection_secret_enc?: string | null
          endpoint?: string | null
          query?: string | null
          schedule?: string
          enabled?: boolean
          last_synced_at?: string | null
          last_status?: string | null
          last_error?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cbs_feed_sync_log: {
        Row: {
          id: string
          connection_id: string
          institution_id: string
          started_at: string
          finished_at: string | null
          status: string
          rows_ingested: number
          error_message: string | null
        }
        Insert: {
          id?: string
          connection_id: string
          institution_id: string
          started_at?: string
          finished_at?: string | null
          status?: string
          rows_ingested?: number
          error_message?: string | null
        }
        Update: {
          id?: string
          connection_id?: string
          institution_id?: string
          started_at?: string
          finished_at?: string | null
          status?: string
          rows_ingested?: number
          error_message?: string | null
        }
        Relationships: []
      }
      regulatory_filings: {
        Row: {
          case_id: string | null
          created_at: string
          currency: string
          customer_id: string | null
          due_at: string
          filed_at: string | null
          filing_ref: string | null
          filing_type: string
          id: string
          institution_id: string
          status: string
          total_amount: number
          transaction_ids: string[]
          transactions_snapshot: Json
          updated_at: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          due_at: string
          filed_at?: string | null
          filing_ref?: string | null
          filing_type: string
          id?: string
          institution_id: string
          status?: string
          total_amount: number
          transaction_ids?: string[]
          transactions_snapshot?: Json
          updated_at?: string
        }
        Update: {
          case_id?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          due_at?: string
          filed_at?: string | null
          filing_ref?: string | null
          filing_type?: string
          id?: string
          institution_id?: string
          status?: string
          total_amount?: number
          transaction_ids?: string[]
          transactions_snapshot?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "regulatory_filings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regulatory_filings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "regulatory_filings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regulatory_filings_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
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
      report_templates: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          definition: Json
          frequency: string | null
          id: string
          regulator: string | null
          status: string
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          definition: Json
          frequency?: string | null
          id?: string
          regulator?: string | null
          status?: string
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          definition?: Json
          frequency?: string | null
          id?: string
          regulator?: string | null
          status?: string
          title?: string
          updated_at?: string
          version?: number
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
          template_id: string | null
          template_version: number | null
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
          template_id?: string | null
          template_version?: number | null
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
          template_id?: string | null
          template_version?: number | null
          user_id?: string
          validation_passed?: boolean | null
          xlsx_url?: string | null
          xml_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      return_templates: {
        Row: {
          created_at: string
          id: string
          institution_id: string
          regulatory_body: string
          report_type: string
          schema_definition: Json
        }
        Insert: {
          created_at?: string
          id?: string
          institution_id?: string
          regulatory_body: string
          report_type: string
          schema_definition: Json
        }
        Update: {
          created_at?: string
          id?: string
          institution_id?: string
          regulatory_body?: string
          report_type?: string
          schema_definition?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fk_institution"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_profiles: {
        Row: {
          assessed_at: string
          created_at: string | null
          customer_id: string
          expires_at: string | null
          factors: Json
          id: string
          institution_id: string
          risk_score: number
          risk_tier: string
        }
        Insert: {
          assessed_at?: string
          created_at?: string | null
          customer_id: string
          expires_at?: string | null
          factors?: Json
          id?: string
          institution_id: string
          risk_score: number
          risk_tier: string
        }
        Update: {
          assessed_at?: string
          created_at?: string | null
          customer_id?: string
          expires_at?: string | null
          factors?: Json
          id?: string
          institution_id?: string
          risk_score?: number
          risk_tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_scores: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          feature_importance: Json | null
          id: string
          institution_id: string
          model_version: string
          score: number
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          feature_importance?: Json | null
          id?: string
          institution_id: string
          model_version: string
          score: number
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          feature_importance?: Json | null
          id?: string
          institution_id?: string
          model_version?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "risk_scores_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: string
          institution_id: string
          profile_id: string
          role: string
        }
        Insert: {
          created_at?: string
          id?: string
          institution_id: string
          profile_id: string
          role: string
        }
        Update: {
          created_at?: string
          id?: string
          institution_id?: string
          profile_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sanctions_config: {
        Row: {
          institution_id: string
          is_active: boolean | null
          watchlist_name: string
        }
        Insert: {
          institution_id: string
          is_active?: boolean | null
          watchlist_name: string
        }
        Update: {
          institution_id?: string
          is_active?: boolean | null
          watchlist_name?: string
        }
        Relationships: []
      }
      sanctions_entries: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          institution_id: string
          match_score: number | null
          matched_name: string
          watchlist_name: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          institution_id: string
          match_score?: number | null
          matched_name: string
          watchlist_name: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          institution_id?: string
          match_score?: number | null
          matched_name?: string
          watchlist_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sanctions_entries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      sanctions_screen_results: {
        Row: {
          created_at: string | null
          customer_id: string | null
          entity_details: Json | null
          id: string
          institution_id: string
          list_name: string | null
          match_score: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          entity_details?: Json | null
          id?: string
          institution_id: string
          list_name?: string | null
          match_score?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          entity_details?: Json | null
          id?: string
          institution_id?: string
          list_name?: string | null
          match_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sanctions_screen_results_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctions_screen_results_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      screening_results: {
        Row: {
          action_taken: string | null
          created_at: string
          customer_id: string | null
          highest_risk: string
          id: string
          institution_id: string
          match_details: Json | null
          matches_found: number
          notes: string | null
          screened_by: string | null
          search_bvn_hash: string | null
          search_date: string
          search_name_hash: string | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          customer_id?: string | null
          highest_risk?: string
          id?: string
          institution_id: string
          match_details?: Json | null
          matches_found?: number
          notes?: string | null
          screened_by?: string | null
          search_bvn_hash?: string | null
          search_date?: string
          search_name_hash?: string | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          customer_id?: string | null
          highest_risk?: string
          id?: string
          institution_id?: string
          match_details?: Json | null
          matches_found?: number
          notes?: string | null
          screened_by?: string | null
          search_bvn_hash?: string | null
          search_date?: string
          search_name_hash?: string | null
          user_id?: string
        }
        Relationships: []
      }
      staging_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          source: string
          status: string
          title: string
          url: string
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          source: string
          status?: string
          title: string
          url: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          source?: string
          status?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      str_candidates: {
        Row: {
          created_at: string | null
          customer_id: string | null
          filing_status: string | null
          id: string
          institution_id: string
          reason: string | null
          risk_score_at_filing: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          filing_status?: string | null
          id?: string
          institution_id: string
          reason?: string | null
          risk_score_at_filing?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          filing_status?: string | null
          id?: string
          institution_id?: string
          reason?: string | null
          risk_score_at_filing?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "str_candidates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "str_candidates_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
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
      transaction_alerts: {
        Row: {
          case_id: string | null
          category: string
          created_at: string
          customer_id: string | null
          evidence: Json
          id: string
          rule_code: string
          rule_title: string
          score: number
          severity: string
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id?: string | null
          category: string
          created_at?: string
          customer_id?: string | null
          evidence?: Json
          id?: string
          rule_code: string
          rule_title: string
          score?: number
          severity?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string | null
          category?: string
          created_at?: string
          customer_id?: string | null
          evidence?: Json
          id?: string
          rule_code?: string
          rule_title?: string
          score?: number
          severity?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_alerts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_alerts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "v_str_due"
            referencedColumns: ["case_id"]
          },
          {
            foreignKeyName: "transaction_alerts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "unified_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_events: {
        Row: {
          account_number_hash: string
          amount: number
          bvn_hash: string
          channel: string | null
          created_at: string
          customer_id: string
          entity_type: string
          id: string
          institution_id: string
          path: string
          phone_hash: string
        }
        Insert: {
          account_number_hash: string
          amount: number
          bvn_hash: string
          channel?: string | null
          created_at?: string
          customer_id: string
          entity_type?: string
          id?: string
          institution_id: string
          path?: string
          phone_hash: string
        }
        Update: {
          account_number_hash?: string
          amount?: number
          bvn_hash?: string
          channel?: string | null
          created_at?: string
          customer_id?: string
          entity_type?: string
          id?: string
          institution_id?: string
          path?: string
          phone_hash?: string
        }
        Relationships: []
      }
      transaction_ingestion_events: {
        Row: {
          created_at: string
          error: string | null
          id: string
          idempotency_key: string
          institution_id: string
          payload: Json
          request_hash: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          idempotency_key: string
          institution_id: string
          payload: Json
          request_hash: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          idempotency_key?: string
          institution_id?: string
          payload?: Json
          request_hash?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_ingestion_events_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_ingestion_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_review_events: {
        Row: {
          change_reason: string | null
          changed_at: string
          changed_by: string | null
          id: string
          institution_id: string | null
          metadata: Json
          new_review_status: string
          old_review_status: string | null
          transaction_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          institution_id?: string | null
          metadata?: Json
          new_review_status: string
          old_review_status?: string | null
          transaction_id: string
        }
        Update: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          institution_id?: string | null
          metadata?: Json
          new_review_status?: string
          old_review_status?: string | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_review_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "unified_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_reviews: {
        Row: {
          account_number_hash: string | null
          amount: number | null
          case_number: string | null
          channel: string | null
          created_at: string
          customer_id: string | null
          customer_name_hash: string | null
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
          account_number_hash?: string | null
          amount?: number | null
          case_number?: string | null
          channel?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name_hash?: string | null
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
          account_number_hash?: string | null
          amount?: number | null
          case_number?: string | null
          channel?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name_hash?: string | null
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
      transaction_rules: {
        Row: {
          category: string
          citation: string | null
          created_at: string
          description: string
          enabled: boolean
          id: string
          regulator: string | null
          rule_code: string
          severity: string
          threshold: Json
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          citation?: string | null
          created_at?: string
          description: string
          enabled?: boolean
          id?: string
          regulator?: string | null
          rule_code: string
          severity?: string
          threshold?: Json
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          citation?: string | null
          created_at?: string
          description?: string
          enabled?: boolean
          id?: string
          regulator?: string | null
          rule_code?: string
          severity?: string
          threshold?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          channel: string
          created_at: string | null
          customer_id: string | null
          id: string
          institution_id: string
          transaction_type: string
        }
        Insert: {
          amount: number
          channel: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          institution_id: string
          transaction_type: string
        }
        Update: {
          amount?: number
          channel?: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          institution_id?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_transactions: {
        Row: {
          account_number_hash: string | null
          amount: number
          balance_after: number | null
          branch_code: string | null
          channel: string | null
          checker_group_id: string | null
          counterparty: string | null
          counterparty_hash: string | null
          created_at: string
          currency: string | null
          customer_id: string | null
          customer_name_hash: string | null
          description: string | null
          description_hash: string | null
          flag_reason: string | null
          flag_rule: string | null
          flag_severity: string | null
          id: string
          institution_id: string | null
          is_flagged: boolean
          narration: string | null
          narration_hash: string | null
          reference: string | null
          review_notes: string | null
          review_status: string
          status: string | null
          str_filed_at: string | null
          str_reference: string | null
          transaction_date: string
          transaction_ref: string | null
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          account_number_hash?: string | null
          amount?: number
          balance_after?: number | null
          branch_code?: string | null
          channel?: string | null
          checker_group_id?: string | null
          counterparty?: string | null
          counterparty_hash?: string | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          customer_name_hash?: string | null
          description?: string | null
          description_hash?: string | null
          flag_reason?: string | null
          flag_rule?: string | null
          flag_severity?: string | null
          id?: string
          institution_id?: string | null
          is_flagged?: boolean
          narration?: string | null
          narration_hash?: string | null
          reference?: string | null
          review_notes?: string | null
          review_status?: string
          status?: string | null
          str_filed_at?: string | null
          str_reference?: string | null
          transaction_date?: string
          transaction_ref?: string | null
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          account_number_hash?: string | null
          amount?: number
          balance_after?: number | null
          branch_code?: string | null
          channel?: string | null
          checker_group_id?: string | null
          counterparty?: string | null
          counterparty_hash?: string | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          customer_name_hash?: string | null
          description?: string | null
          description_hash?: string | null
          flag_reason?: string | null
          flag_rule?: string | null
          flag_severity?: string | null
          id?: string
          institution_id?: string | null
          is_flagged?: boolean
          narration?: string | null
          narration_hash?: string | null
          reference?: string | null
          review_notes?: string | null
          review_status?: string
          status?: string | null
          str_filed_at?: string | null
          str_reference?: string | null
          transaction_date?: string
          transaction_ref?: string | null
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unified_transactions_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
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
      users: {
        Row: {
          created_at: string | null
          email_hash: string
          full_name_hash: string | null
          id: string
          institution_id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email_hash: string
          full_name_hash?: string | null
          id?: string
          institution_id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          email_hash?: string
          full_name_hash?: string | null
          id?: string
          institution_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_sessions: {
        Row: {
          bvn_hash: string | null
          created_at: string
          customer_id: string | null
          id: string
          institution_id: string
          phone_hash: string | null
          provider: string
          status: string
          updated_at: string
        }
        Insert: {
          bvn_hash?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          institution_id: string
          phone_hash?: string | null
          provider: string
          status?: string
          updated_at?: string
        }
        Update: {
          bvn_hash?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          institution_id?: string
          phone_hash?: string | null
          provider?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      watchlist_entities: {
        Row: {
          created_at: string
          entity_type: string | null
          full_name_hash: string | null
          id: string
          institution_id: string
          is_global: boolean | null
          metadata: Json | null
          risk_level: string | null
          search_vector: unknown
          source_provider: string | null
        }
        Insert: {
          created_at?: string
          entity_type?: string | null
          full_name_hash?: string | null
          id?: string
          institution_id?: string
          is_global?: boolean | null
          metadata?: Json | null
          risk_level?: string | null
          search_vector?: unknown
          source_provider?: string | null
        }
        Update: {
          created_at?: string
          entity_type?: string | null
          full_name_hash?: string | null
          id?: string
          institution_id?: string
          is_global?: boolean | null
          metadata?: Json | null
          risk_level?: string | null
          search_vector?: unknown
          source_provider?: string | null
        }
        Relationships: []
      }
      watchlist_matches: {
        Row: {
          created_at: string | null
          id: string
          institution_id: string
          match_score: number
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          transaction_id: string
          watchlist_entity_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          institution_id: string
          match_score: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          transaction_id: string
          watchlist_entity_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          institution_id?: string
          match_score?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          transaction_id?: string
          watchlist_entity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_institution"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
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
      webhook_events: {
        Row: {
          created_at: string | null
          delivery_status: string | null
          event_type: string
          id: string
          institution_id: string
          payload: Json | null
          target_url: string
        }
        Insert: {
          created_at?: string | null
          delivery_status?: string | null
          event_type: string
          id?: string
          institution_id: string
          payload?: Json | null
          target_url: string
        }
        Update: {
          created_at?: string | null
          delivery_status?: string | null
          event_type?: string
          id?: string
          institution_id?: string
          payload?: Json | null
          target_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      pii_high_risk_plaintext: {
        Row: {
          column_default: string | null
          column_name: unknown
          data_type: string | null
          is_nullable: string | null
          ordinal_position: number | null
          table_name: unknown
        }
        Relationships: []
      }
      pii_plaintext_inventory: {
        Row: {
          column_default: string | null
          column_name: unknown
          data_type: string | null
          is_nullable: string | null
          ordinal_position: number | null
          table_name: unknown
        }
        Relationships: []
      }
      v_ctr_due: {
        Row: {
          amount: number | null
          channel: string | null
          ctr_due_at: string | null
          currency: string | null
          customer_id: string | null
          external_ref: string | null
          institution_id: string | null
          occurred_at: string | null
          threshold_amount: number | null
          transaction_id: string | null
        }
        Relationships: []
      }
      v_ctr_thresholds: {
        Row: {
          currency: string | null
          institution_id: string | null
          threshold_amount: number | null
        }
        Insert: {
          currency?: never
          institution_id?: string | null
          threshold_amount?: never
        }
        Update: {
          currency?: never
          institution_id?: string | null
          threshold_amount?: never
        }
        Relationships: [
          {
            foreignKeyName: "aml_rules_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      v_eod_exceptions: {
        Row: {
          external_ref: string | null
          id: string | null
          institution_id: string | null
          reason: string | null
        }
        Relationships: []
      }
      v_eod_reconciliation: {
        Row: {
          ctr_generated: number | null
          exceptions_count: number | null
          institution_id: string | null
          recon_date: string | null
          status: string | null
          total_amount: number | null
          total_transactions: number | null
        }
        Relationships: []
      }
      v_str_due: {
        Row: {
          alert_id: string | null
          case_id: string | null
          created_at: string | null
          customer_id: string | null
          evidence: Json | null
          institution_id: string | null
          score: number | null
          severity: string | null
          str_due_at: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aml_alerts_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      aml_core_decision: {
        Args: { p_amount_ngn: number; p_customer_type: string }
        Returns: {
          is_flagged: boolean
          risk_level: string
          rule_hit: string
        }[]
      }
      approve_identity_screening: {
        Args: { p_new_status: string; p_notes: string; p_screening_id: string }
        Returns: {
          checks_requested: string[] | null
          created_at: string
          customer_id: string | null
          duplicate_of: string | null
          id: string
          institution_id: string
          metadata: Json
          provider: string | null
          provider_payload: Json | null
          provider_reference: string | null
          provider_status: string | null
          result_status: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_score: number | null
          rule_code: string | null
          score: number
          screening_source: string
          screening_type: string
          subject_hash: string
          subject_type: string
          updated_at: string
          verification_url: string | null
        }
        SetofOptions: {
          from: "*"
          to: "identity_screening"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      build_goaml_export: {
        Args: {
          p_generated_by?: string
          p_institution_id: string
          p_period_end: string
          p_period_start: string
          p_report_type: string
        }
        Returns: string
      }
      compile_returns_to_xml:
        | {
            Args: {
              p_institution_id: string
              p_period_end: string
              p_period_start: string
              p_template_id: string
            }
            Returns: string
          }
        | {
            Args: {
              p_period_end: string
              p_period_start: string
              p_template_id: string
            }
            Returns: string
          }
      current_actor_id: { Args: never; Returns: string }
      current_institution_id: { Args: never; Returns: string }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      fn_append_audit_log: {
        Args: {
          p_action: string
          p_entity: string
          p_entity_id: string
          p_payload: Json
          p_user_id: string
        }
        Returns: string
      }
      fn_atomic_kyc_success:
        | {
            Args: {
              p_bvn_hash: string
              p_customer_id: string
              p_institution_id: string
              p_score: number
            }
            Returns: undefined
          }
        | {
            Args: {
              p_bvn_hash: string
              p_customer_id: string
              p_institution_id: string
              p_match_score: number
              p_provider: string
              p_provider_ref: string
              p_request_hash: string
              p_response_enc: string
              p_status: string
            }
            Returns: undefined
          }
      fn_decrypt_pii: { Args: { p_cipher: string }; Returns: string }
      fn_encrypt_pii: { Args: { p_data: string }; Returns: string }
      fn_eod_reconcile: {
        Args: { p_date: string; p_institution_id: string }
        Returns: {
          created_at: string
          ctr_generated: number
          details: Json
          exceptions_count: number
          id: string
          institution_id: string
          recon_date: string
          status: string
          str_due: number
          total_amount: number
          total_transactions: number
        }
        SetofOptions: {
          from: "*"
          to: "eod_reconciliation"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      fn_eod_signoff: {
        Args: { p_date: string; p_officer: string }
        Returns: string
      }
      fn_evaluate_transaction: { Args: { p_txn_id: string }; Returns: number }
      fn_generate_daily_ctr: {
        Args: { p_date: string; p_institution_id: string }
        Returns: number
      }
      fn_hash_bvn: { Args: { p_bvn: string }; Returns: string }
      fn_metadata_has_pii: { Args: { p_meta: Json }; Returns: boolean }
      fn_rescan_transactions: {
        Args: { p_limit?: number; p_user_id: string }
        Returns: number
      }
      fn_verify_audit_chain: {
        Args: never
        Returns: {
          actual_hash: string
          expected_hash: string
          failed_log_id: string
          is_valid: boolean
          total_checked: number
        }[]
      }
      get_institution_id: { Args: never; Returns: string }
      get_pending_maker_checker_backlog: {
        Args: { p_customer_id?: string }
        Returns: {
          amount: number
          created_at: string
          customer_id: string
          is_overdue: boolean
          review_status: string
          sla_deadline: string
          transaction_id: string
        }[]
      }
      has_institution_role: {
        Args: {
          p_institution_id: string
          p_profile_id: string
          p_roles: string[]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      ingest_signed_transaction: {
        Args: {
          p_api_key: string
          p_body_text: string
          p_idempotency_key: string
          p_key_hash_secret: string
          p_key_prefix: string
          p_payload: Json
          p_signature: string
          p_timestamp: string
        }
        Returns: {
          queue_job_id: string
          status: string
          transaction_id: string
        }[]
      }
      ingest_transaction_webhook: {
        Args: {
          p_idempotency_key: string
          p_institution_id: string
          p_raw_payload: Json
          p_request_signature: string
        }
        Returns: string
      }
      is_alert_admin: {
        Args: { p_institution_id: string; p_profile_id: string }
        Returns: boolean
      }
      is_checker: {
        Args: { p_institution_id: string; p_profile_id: string }
        Returns: boolean
      }
      is_maker: {
        Args: { p_institution_id: string; p_profile_id: string }
        Returns: boolean
      }
      lock_next_job: {
        Args: never
        Returns: {
          args_hash: string | null
          attempts: number | null
          created_at: string | null
          error: string | null
          id: string
          institution_id: string
          job_type: string
          path: string | null
          payload: Json | null
          result: Json | null
          status: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "queue_jobs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      match_knowledge_base:
        | {
            Args: {
              match_count: number
              match_threshold: number
              query_embedding: string
            }
            Returns: {
              content: string
              document_title: string
              id: string
              jurisdiction: string
              regulator: string
              similarity: number
              source_name: string
            }[]
          }
        | {
            Args: {
              match_count: number
              match_threshold: number
              p_institution_id: string
              query_embedding: string
            }
            Returns: {
              content: string
              id: string
              institution_id: string
              similarity: number
            }[]
          }
      review_aml_alert: {
        Args: { p_alert_id: string; p_new_status: string; p_note: string }
        Returns: undefined
      }
      review_fraud_alert: {
        Args: { p_alert_id: string; p_new_status: string; p_note: string }
        Returns: undefined
      }
      review_identity_screening: {
        Args: { p_new_status: string; p_note: string; p_screening_id: string }
        Returns: undefined
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      transition_alert: {
        Args: {
          p_actor_id: string
          p_alert_id: string
          p_comment?: string
          p_new_status: string
        }
        Returns: {
          assigned_to: string | null
          checker_comment: string | null
          checker_id: string | null
          created_at: string | null
          id: string
          institution_id: string
          maker_comment: string | null
          maker_id: string | null
          rule_id: string | null
          severity: string | null
          status: string | null
          transaction_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "alerts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      aml_job_status: "queued" | "processing" | "completed" | "failed"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      aml_job_status: ["queued", "processing", "completed", "failed"],
      app_role: ["admin", "user", "compliance_lead"],
    },
  },
} as const
