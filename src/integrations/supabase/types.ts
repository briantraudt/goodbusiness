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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          admin_id: string | null
          id: string
          role: Database["public"]["Enums"]["admin_role"]
        }
        Insert: {
          admin_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
        }
        Update: {
          admin_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
        }
        Relationships: [
          {
            foreignKeyName: "admin_roles_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          password: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password?: string
        }
        Relationships: []
      }
      beta_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      business_evaluations: {
        Row: {
          created_at: string | null
          email: string | null
          evaluation_date: string | null
          id: string
          idea: string
          name: string | null
          result: string | null
          score: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          evaluation_date?: string | null
          id?: string
          idea: string
          name?: string | null
          result?: string | null
          score?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          evaluation_date?: string | null
          id?: string
          idea?: string
          name?: string | null
          result?: string | null
          score?: number | null
        }
        Relationships: []
      }
      business_submissions: {
        Row: {
          additional_info: string | null
          budget: string
          business_idea: string
          business_stage: string
          company_name: string | null
          created_at: string
          customers: string | null
          email: string
          full_name: string
          help_types: string[] | null
          id: string
          idea_score: number | null
          other_help_explanation: string | null
          phone: string | null
          problem_solution: string
          profit_type: string
          social_impact: string | null
        }
        Insert: {
          additional_info?: string | null
          budget: string
          business_idea: string
          business_stage: string
          company_name?: string | null
          created_at?: string
          customers?: string | null
          email: string
          full_name: string
          help_types?: string[] | null
          id?: string
          idea_score?: number | null
          other_help_explanation?: string | null
          phone?: string | null
          problem_solution: string
          profit_type: string
          social_impact?: string | null
        }
        Update: {
          additional_info?: string | null
          budget?: string
          business_idea?: string
          business_stage?: string
          company_name?: string | null
          created_at?: string
          customers?: string | null
          email?: string
          full_name?: string
          help_types?: string[] | null
          id?: string
          idea_score?: number | null
          other_help_explanation?: string | null
          phone?: string | null
          problem_solution?: string
          profit_type?: string
          social_impact?: string | null
        }
        Relationships: []
      }
      client_access: {
        Row: {
          access_code: string
          client_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          access_code: string
          client_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          access_code?: string
          client_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_contacts: {
        Row: {
          client_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          slug: string | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          slug?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          slug?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      confidence_adjustments: {
        Row: {
          adjustment: number
          category: string
          category_type: string
          id: string
          last_updated: string
          loss_count: number
          total_trades: number
          win_count: number
        }
        Insert: {
          adjustment?: number
          category: string
          category_type: string
          id?: string
          last_updated?: string
          loss_count?: number
          total_trades?: number
          win_count?: number
        }
        Update: {
          adjustment?: number
          category?: string
          category_type?: string
          id?: string
          last_updated?: string
          loss_count?: number
          total_trades?: number
          win_count?: number
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          price: number
          quantity: number
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          price: number
          quantity?: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          contact_id: string | null
          created_at: string
          date: string
          due_date: string
          id: string
          invoice_number: string
          notes: string | null
          paid_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          contact_id?: string | null
          created_at?: string
          date?: string
          due_date: string
          id?: string
          invoice_number: string
          notes?: string | null
          paid_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          contact_id?: string | null
          created_at?: string
          date?: string
          due_date?: string
          id?: string
          invoice_number?: string
          notes?: string | null
          paid_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "client_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          invoice_id: string
          paid_at: string | null
          status: string
          stripe_payment_intent_id: string
          stripe_session_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          invoice_id: string
          paid_at?: string | null
          status: string
          stripe_payment_intent_id: string
          stripe_session_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          invoice_id?: string
          paid_at?: string | null
          status?: string
          stripe_payment_intent_id?: string
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          sku: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price?: number
          sku?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          sku?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_address_line_1: string | null
          business_address_line_2: string | null
          business_city: string | null
          business_email: string | null
          business_name: string | null
          business_phone: string | null
          business_state: string | null
          business_zip_code: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          business_address_line_1?: string | null
          business_address_line_2?: string | null
          business_city?: string | null
          business_email?: string | null
          business_name?: string | null
          business_phone?: string | null
          business_state?: string | null
          business_zip_code?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          business_address_line_1?: string | null
          business_address_line_2?: string | null
          business_city?: string | null
          business_email?: string | null
          business_name?: string | null
          business_phone?: string | null
          business_state?: string | null
          business_zip_code?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          project_id: string
          title: string
        }
        Insert: {
          created_at?: string
          date?: string
          description: string
          id?: string
          project_id: string
          title: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          embed_project: boolean | null
          id: string
          name: string
          project_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          embed_project?: boolean | null
          id?: string
          name: string
          project_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          embed_project?: boolean | null
          id?: string
          name?: string
          project_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      scan_results: {
        Row: {
          id: string
          scan_data: Json
          scanned_at: string
          source: string
          top_tickers: string[] | null
          total_scanned: number
          trades_found: number
        }
        Insert: {
          id?: string
          scan_data: Json
          scanned_at?: string
          source?: string
          top_tickers?: string[] | null
          total_scanned?: number
          trades_found?: number
        }
        Update: {
          id?: string
          scan_data?: Json
          scanned_at?: string
          source?: string
          top_tickers?: string[] | null
          total_scanned?: number
          trades_found?: number
        }
        Relationships: []
      }
      story_content: {
        Row: {
          content: string
          created_at: string
          id: string
          media_blocks: Json
          story_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          media_blocks?: Json
          story_id?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_blocks?: Json
          story_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_content_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "user_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_history: {
        Row: {
          atr_exhaustion_applied: boolean | null
          confidence_score: number
          created_at: string
          direction: string
          entry_price: number
          exit_price: number | null
          final_trade_score: number | null
          id: string
          invalidation_level: number | null
          market_state: string
          max_adverse_excursion: number | null
          max_favorable_excursion: number | null
          rationale: string[] | null
          result: string | null
          spy_direction: string | null
          structure_respected: boolean | null
          ticker: string
          trade_date: string
          updated_at: string
          vwap_respected: boolean | null
        }
        Insert: {
          atr_exhaustion_applied?: boolean | null
          confidence_score: number
          created_at?: string
          direction: string
          entry_price: number
          exit_price?: number | null
          final_trade_score?: number | null
          id?: string
          invalidation_level?: number | null
          market_state: string
          max_adverse_excursion?: number | null
          max_favorable_excursion?: number | null
          rationale?: string[] | null
          result?: string | null
          spy_direction?: string | null
          structure_respected?: boolean | null
          ticker: string
          trade_date: string
          updated_at?: string
          vwap_respected?: boolean | null
        }
        Update: {
          atr_exhaustion_applied?: boolean | null
          confidence_score?: number
          created_at?: string
          direction?: string
          entry_price?: number
          exit_price?: number | null
          final_trade_score?: number | null
          id?: string
          invalidation_level?: number | null
          market_state?: string
          max_adverse_excursion?: number | null
          max_favorable_excursion?: number | null
          rationale?: string[] | null
          result?: string | null
          spy_direction?: string | null
          structure_respected?: boolean | null
          ticker?: string
          trade_date?: string
          updated_at?: string
          vwap_respected?: boolean | null
        }
        Relationships: []
      }
      trade_journal: {
        Row: {
          atr: number | null
          confidence: number | null
          contract_symbol: string | null
          created_at: string
          direction: string
          entry_price: number
          entry_stock_price: number | null
          entry_time: string
          exit_price: number | null
          exit_stock_price: number | null
          exit_time: string | null
          expiration: string | null
          id: string
          invalidation_level: number | null
          market_state: string | null
          notes: string | null
          pnl: number | null
          pnl_percent: number | null
          quantity: number
          r_multiple: number | null
          rationale: string[] | null
          relative_volume: number | null
          status: string
          strike: number | null
          ticker: string
          user_id: string
        }
        Insert: {
          atr?: number | null
          confidence?: number | null
          contract_symbol?: string | null
          created_at?: string
          direction: string
          entry_price: number
          entry_stock_price?: number | null
          entry_time?: string
          exit_price?: number | null
          exit_stock_price?: number | null
          exit_time?: string | null
          expiration?: string | null
          id?: string
          invalidation_level?: number | null
          market_state?: string | null
          notes?: string | null
          pnl?: number | null
          pnl_percent?: number | null
          quantity?: number
          r_multiple?: number | null
          rationale?: string[] | null
          relative_volume?: number | null
          status?: string
          strike?: number | null
          ticker: string
          user_id: string
        }
        Update: {
          atr?: number | null
          confidence?: number | null
          contract_symbol?: string | null
          created_at?: string
          direction?: string
          entry_price?: number
          entry_stock_price?: number | null
          entry_time?: string
          exit_price?: number | null
          exit_stock_price?: number | null
          exit_time?: string | null
          expiration?: string | null
          id?: string
          invalidation_level?: number | null
          market_state?: string | null
          notes?: string | null
          pnl?: number | null
          pnl_percent?: number | null
          quantity?: number
          r_multiple?: number | null
          rationale?: string[] | null
          relative_volume?: number | null
          status?: string
          strike?: number | null
          ticker?: string
          user_id?: string
        }
        Relationships: []
      }
      trade_snapshots: {
        Row: {
          atr: number
          atr_exhaustion_applied: boolean
          confidence: number
          created_at: string
          days_to_expiration: number | null
          delta: number | null
          direction: string
          directional_bias: string
          entry_price: number | null
          expected_move_remaining: number | null
          final_score: number
          id: string
          implied_volatility: number | null
          liquidity_rating: string | null
          margin_percent: number | null
          market_state: string
          premium: number | null
          previous_day_high: number
          previous_day_low: number
          regime_passed: boolean
          relative_volume: number
          required_move: number | null
          spy_change: number | null
          state_weight: number | null
          structure_clarity: number | null
          swing_high: number | null
          swing_low: number | null
          ticker: string
          time_context: string
          trade_date: string
          volume_quality: number | null
          vwap: number
        }
        Insert: {
          atr: number
          atr_exhaustion_applied?: boolean
          confidence: number
          created_at?: string
          days_to_expiration?: number | null
          delta?: number | null
          direction: string
          directional_bias: string
          entry_price?: number | null
          expected_move_remaining?: number | null
          final_score: number
          id?: string
          implied_volatility?: number | null
          liquidity_rating?: string | null
          margin_percent?: number | null
          market_state: string
          premium?: number | null
          previous_day_high: number
          previous_day_low: number
          regime_passed?: boolean
          relative_volume: number
          required_move?: number | null
          spy_change?: number | null
          state_weight?: number | null
          structure_clarity?: number | null
          swing_high?: number | null
          swing_low?: number | null
          ticker: string
          time_context: string
          trade_date: string
          volume_quality?: number | null
          vwap: number
        }
        Update: {
          atr?: number
          atr_exhaustion_applied?: boolean
          confidence?: number
          created_at?: string
          days_to_expiration?: number | null
          delta?: number | null
          direction?: string
          directional_bias?: string
          entry_price?: number | null
          expected_move_remaining?: number | null
          final_score?: number
          id?: string
          implied_volatility?: number | null
          liquidity_rating?: string | null
          margin_percent?: number | null
          market_state?: string
          premium?: number | null
          previous_day_high?: number
          previous_day_low?: number
          regime_passed?: boolean
          relative_volume?: number
          required_move?: number | null
          spy_change?: number | null
          state_weight?: number | null
          structure_clarity?: number | null
          swing_high?: number | null
          swing_low?: number | null
          ticker?: string
          time_context?: string
          trade_date?: string
          volume_quality?: number | null
          vwap?: number
        }
        Relationships: []
      }
      training_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string
          email: string
          id: string
          name: string
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string
          email: string
          id?: string
          name: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          userid: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          userid: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          userid?: string
        }
        Relationships: []
      }
      user_garments: {
        Row: {
          category: string | null
          created_at: string
          extracted_image_url: string | null
          id: string
          name: string | null
          original_image_url: string | null
          price: string | null
          store_name: string | null
          store_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          extracted_image_url?: string | null
          id?: string
          name?: string | null
          original_image_url?: string | null
          price?: string | null
          store_name?: string | null
          store_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          extracted_image_url?: string | null
          id?: string
          name?: string | null
          original_image_url?: string | null
          price?: string | null
          store_name?: string | null
          store_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          enableaisuggestions: boolean
          name: string | null
          timezone: string
          updated_at: string
          user_id: string
          workinghourend: string
          workinghourstart: string
          workstyle: string
        }
        Insert: {
          created_at?: string
          enableaisuggestions?: boolean
          name?: string | null
          timezone?: string
          updated_at?: string
          user_id: string
          workinghourend?: string
          workinghourstart?: string
          workstyle?: string
        }
        Update: {
          created_at?: string
          enableaisuggestions?: boolean
          name?: string | null
          timezone?: string
          updated_at?: string
          user_id?: string
          workinghourend?: string
          workinghourstart?: string
          workstyle?: string
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
      user_stock_selections: {
        Row: {
          created_at: string
          id: string
          tickers: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tickers: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tickers?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_stories: {
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
          title: string
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
        Relationships: []
      }
      user_tasks: {
        Row: {
          category: string | null
          completed: boolean
          created_at: string
          description: string | null
          duedate: string | null
          id: string
          priority: string
          timeestimate: number | null
          title: string
          updated_at: string
          userid: string
        }
        Insert: {
          category?: string | null
          completed?: boolean
          created_at?: string
          description?: string | null
          duedate?: string | null
          id?: string
          priority?: string
          timeestimate?: number | null
          title: string
          updated_at?: string
          userid: string
        }
        Update: {
          category?: string | null
          completed?: boolean
          created_at?: string
          description?: string | null
          duedate?: string | null
          id?: string
          priority?: string
          timeestimate?: number | null
          title?: string
          updated_at?: string
          userid?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_credentials: {
        Args: { email_param: string; password_param: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_client_access: {
        Args: { code: string; slug: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "admin"
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
      admin_role: ["admin"],
      app_role: ["admin", "user"],
    },
  },
} as const
