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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      custom_request_milestones: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          progress_notes: string | null
          request_id: string
          screenshot_url: string | null
          status: string | null
          title: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          progress_notes?: string | null
          request_id: string
          screenshot_url?: string | null
          status?: string | null
          title: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          progress_notes?: string | null
          request_id?: string
          screenshot_url?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_request_milestones_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "custom_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_requests: {
        Row: {
          assigned_to: string | null
          budget_range: string
          category: string | null
          created_at: string
          description: string
          id: string
          preferred_tech: string | null
          status: string | null
          timeline: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          budget_range: string
          category?: string | null
          created_at?: string
          description: string
          id?: string
          preferred_tech?: string | null
          status?: string | null
          timeline?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          preferred_tech?: string | null
          status?: string | null
          timeline?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      developer_auth: {
        Row: {
          created_at: string
          display_name: string
          email: string
          id: string
          invitation_code: string
          last_login: string | null
          star_rating: number
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          display_name: string
          email: string
          id?: string
          invitation_code: string
          last_login?: string | null
          star_rating: number
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          invitation_code?: string
          last_login?: string | null
          star_rating?: number
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      developer_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invitation_code: string
          invited_at: string
          invited_by: string
          star_rating: number
          status: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invitation_code: string
          invited_at?: string
          invited_by: string
          star_rating: number
          status?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invitation_code?: string
          invited_at?: string
          invited_by?: string
          star_rating?: number
          status?: string | null
        }
        Relationships: []
      }
      developer_messages: {
        Row: {
          attachments: string[] | null
          created_at: string
          custom_request_id: string
          id: string
          message: string
          sender_id: string
          sender_type: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string
          custom_request_id: string
          id?: string
          message: string
          sender_id: string
          sender_type: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string
          custom_request_id?: string
          id?: string
          message?: string
          sender_id?: string
          sender_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      developer_projects: {
        Row: {
          admin_notes: string | null
          assigned_at: string
          assigned_by: string
          completed_at: string | null
          created_at: string
          custom_request_id: string
          deadline: string | null
          developer_id: string
          id: string
          project_file_url: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_at?: string
          assigned_by: string
          completed_at?: string | null
          created_at?: string
          custom_request_id: string
          deadline?: string | null
          developer_id: string
          id?: string
          project_file_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          assigned_at?: string
          assigned_by?: string
          completed_at?: string | null
          created_at?: string
          custom_request_id?: string
          deadline?: string | null
          developer_id?: string
          id?: string
          project_file_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_projects_custom_request_id_fkey"
            columns: ["custom_request_id"]
            isOneToOne: false
            referencedRelation: "custom_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          daily_digest: boolean | null
          email_notifications: boolean | null
          id: string
          milestone_updates: boolean | null
          project_status_updates: boolean | null
          push_notifications: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_digest?: boolean | null
          email_notifications?: boolean | null
          id?: string
          milestone_updates?: boolean | null
          project_status_updates?: boolean | null
          push_notifications?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_digest?: boolean | null
          email_notifications?: boolean | null
          id?: string
          milestone_updates?: boolean | null
          project_status_updates?: boolean | null
          push_notifications?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          related_request_id: string | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          related_request_id?: string | null
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          related_request_id?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_request_id_fkey"
            columns: ["related_request_id"]
            isOneToOne: false
            referencedRelation: "custom_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          invitation_code: string | null
          role: string | null
          star_rating: number | null
          updated_at: string
          user_id: string
          user_type: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          invitation_code?: string | null
          role?: string | null
          star_rating?: number | null
          updated_at?: string
          user_id: string
          user_type?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          invitation_code?: string | null
          role?: string | null
          star_rating?: number | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      project_likes: {
        Row: {
          created_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_likes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_ratings: {
        Row: {
          created_at: string
          id: string
          project_id: string
          rating: number
          review: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          rating: number
          review?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          rating?: number
          review?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          admin_notes: string | null
          category: string | null
          created_at: string
          description: string | null
          download_url: string | null
          features: string[] | null
          id: string
          images: string[] | null
          price_inr: number
          screenshot_url: string | null
          seller_id: string
          status: string | null
          tech_stack: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          download_url?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          price_inr: number
          screenshot_url?: string | null
          seller_id: string
          status?: string | null
          tech_stack?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          download_url?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          price_inr?: number
          screenshot_url?: string | null
          seller_id?: string
          status?: string | null
          tech_stack?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      purchases: {
        Row: {
          amount_paid: number
          buyer_id: string
          currency: string | null
          download_url: string | null
          id: string
          payment_method: string | null
          project_id: string
          purchased_at: string
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount_paid: number
          buyer_id: string
          currency?: string | null
          download_url?: string | null
          id?: string
          payment_method?: string | null
          project_id: string
          purchased_at?: string
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount_paid?: number
          buyer_id?: string
          currency?: string | null
          download_url?: string | null
          id?: string
          payment_method?: string | null
          project_id?: string
          purchased_at?: string
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string
          id: string
          results_count: number | null
          search_filters: Json | null
          search_query: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          results_count?: number | null
          search_filters?: Json | null
          search_query: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          results_count?: number | null
          search_filters?: Json | null
          search_query?: string
          user_id?: string
        }
        Relationships: []
      }
      sell_projects: {
        Row: {
          admin_notes: string | null
          category: string | null
          created_at: string
          demo_command: string | null
          description: string | null
          features: string[] | null
          file_url: string | null
          id: string
          price_inr: number
          seller_id: string
          status: string | null
          tech_stack: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          category?: string | null
          created_at?: string
          demo_command?: string | null
          description?: string | null
          features?: string[] | null
          file_url?: string | null
          id?: string
          price_inr: number
          seller_id: string
          status?: string | null
          tech_stack?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          category?: string | null
          created_at?: string
          demo_command?: string | null
          description?: string | null
          features?: string[] | null
          file_url?: string | null
          id?: string
          price_inr?: number
          seller_id?: string
          status?: string | null
          tech_stack?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      seller_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_projects: number
          plan_type: string
          subscribed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_projects?: number
          plan_type?: string
          subscribed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_projects?: number
          plan_type?: string
          subscribed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          star_rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          star_rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          star_rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_developer_avg_rating: {
        Args: { developer_user_id: string }
        Returns: number
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authenticated_developer: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_invited_developer: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      link_developer_auth: {
        Args: { p_email: string; p_invitation_code: string; p_user_id: string }
        Returns: Json
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      register_invited_developer: {
        Args: {
          p_display_name: string
          p_email: string
          p_invitation_code: string
          p_password: string
        }
        Returns: Json
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      verify_developer_auth: {
        Args: { p_email: string; p_invitation_code: string }
        Returns: Json
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "buyer"
        | "seller"
        | "developer"
        | "both"
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
      app_role: ["admin", "moderator", "buyer", "seller", "developer", "both"],
    },
  },
} as const
