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
          request_id: string
          status: string | null
          title: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          request_id: string
          status?: string | null
          title: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          request_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      link_developer_auth: {
        Args: { p_email: string; p_invitation_code: string; p_user_id: string }
        Returns: Json
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
      verify_developer_auth: {
        Args: { p_email: string; p_invitation_code: string }
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
