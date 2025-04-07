import type { createClient } from "@supabase/supabase-js"

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          cover_image: string
          published_at: string
          author: string
          category: string
          site_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          cover_image: string
          published_at: string
          author: string
          category: string
          site_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          cover_image?: string
          published_at?: string
          author?: string
          category?: string
          site_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      banner_slides: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          button_text: string
          button_link: string
          order: number
          active: boolean
          site_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          button_text: string
          button_link: string
          order: number
          active: boolean
          site_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          button_text?: string
          button_link?: string
          order?: number
          active?: boolean
          site_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      casinos: {
        Row: {
          id: string
          name: string
          slug: string
          logo: string
          banner: string
          short_description: string
          description: string
          rating: number
          bonus: string
          bonus_details: string
          free_spins: string
          wagering: number
          min_deposit: number
          min_withdrawal: number
          withdrawal_time: string
          featured: boolean
          affiliate_link: string
          game_info: string | null
          game_providers: string[] | null
          payment_methods: string[] | null
          bonuses: Json | null
          site_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo: string
          banner: string
          short_description: string
          description: string
          rating: number
          bonus: string
          bonus_details: string
          free_spins: string
          wagering: number
          min_deposit: number
          min_withdrawal: number
          withdrawal_time: string
          featured: boolean
          affiliate_link: string
          game_info?: string | null
          game_providers?: string[] | null
          payment_methods?: string[] | null
          bonuses?: Json | null
          site_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo?: string
          banner?: string
          short_description?: string
          description?: string
          rating?: number
          bonus?: string
          bonus_details?: string
          free_spins?: string
          wagering?: number
          min_deposit?: number
          min_withdrawal?: number
          withdrawal_time?: string
          featured?: boolean
          affiliate_link?: string
          game_info?: string | null
          game_providers?: string[] | null
          payment_methods?: string[] | null
          bonuses?: Json | null
          site_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      sites: {
        Row: {
          id: string
          name: string
          domain: string
          description: string
          logo: string | null
          theme_color: string | null
          contact_email: string
          social: Json | null
          analytics: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain: string
          description: string
          logo?: string | null
          theme_color?: string | null
          contact_email: string
          social?: Json | null
          analytics?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string
          description?: string
          logo?: string | null
          theme_color?: string | null
          contact_email?: string
          social?: Json | null
          analytics?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          name: string
          key: string
          site_id: string
          created_at: string
          last_used: string | null
          status: string
        }
        Insert: {
          id?: string
          name: string
          key: string
          site_id: string
          created_at?: string
          last_used?: string | null
          status?: string
        }
        Update: {
          id?: string
          name?: string
          key?: string
          site_id?: string
          created_at?: string
          last_used?: string | null
          status?: string
        }
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

export type SupabaseClient = ReturnType<typeof createClient>

