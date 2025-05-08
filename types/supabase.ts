export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          subscription_tier_id: string | null
          subscription_status: string
          trial_ends_at: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subscription_tier_id?: string | null
          subscription_status?: string
          trial_ends_at?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subscription_tier_id?: string | null
          subscription_status?: string
          trial_ends_at?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          auth_id: string | null
          tenant_id: string | null
          email: string
          first_name: string | null
          last_name: string | null
          role: string
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          tenant_id?: string | null
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: string
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          tenant_id?: string | null
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: string
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_invitations: {
        Row: {
          id: string
          tenant_id: string
          email: string
          role: string
          token: string
          expires_at: string
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          email: string
          role?: string
          token: string
          expires_at: string
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string
          email?: string
          role?: string
          token?: string
          expires_at?: string
          created_at?: string
          created_by?: string | null
        }
      }
      affiliate_networks: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          logo_url: string | null
          primary_color: string
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          logo_url?: string | null
          primary_color?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          primary_color?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      affiliate_sites: {
        Row: {
          id: string
          network_id: string
          name: string
          domain: string | null
          template_id: string
          status: string
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          network_id: string
          name: string
          domain?: string | null
          template_id: string
          status?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          network_id?: string
          name?: string
          domain?: string | null
          template_id?: string
          status?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      content_blocks: {
        Row: {
          id: string
          site_id: string
          name: string
          type: string
          content: Json
          position: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_id: string
          name: string
          type: string
          content: Json
          position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          name?: string
          type?: string
          content?: Json
          position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          tenant_id: string | null
          user_id: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          user_id?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          user_id?: string | null
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          details?: Json
          created_at?: string
        }
      }
      white_label_settings: {
        Row: {
          id: string
          tenant_id: string
          company_name: string
          logo_url: string | null
          favicon_url: string | null
          primary_color: string
          secondary_color: string
          custom_css: string | null
          custom_domain: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          company_name: string
          logo_url?: string | null
          favicon_url?: string | null
          primary_color?: string
          secondary_color?: string
          custom_css?: string | null
          custom_domain?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          company_name?: string
          logo_url?: string | null
          favicon_url?: string | null
          primary_color?: string
          secondary_color?: string
          custom_css?: string | null
          custom_domain?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscription_tiers: {
        Row: {
          id: string
          name: string
          description: string | null
          max_sites: number
          max_users: number
          price_monthly: number | null
          price_yearly: number | null
          features: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          max_sites?: number
          max_users?: number
          price_monthly?: number | null
          price_yearly?: number | null
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          max_sites?: number
          max_users?: number
          price_monthly?: number | null
          price_yearly?: number | null
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_current_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string | null
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
  }
}
