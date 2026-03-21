import { createClient, type SupabaseClient } from '@supabase/supabase-js'



// Database types (déclaré avant le client pour que `createClient<Database>` infère correctement les tables)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'client'
          company?: string
          avatar_url?: string
          phone?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'client'
          company?: string
          avatar_url?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'client'
          company?: string
          avatar_url?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description?: string
          status: 'proposal' | 'active' | 'review' | 'completed' | 'on-hold' | 'cancelled'
          client_id: string
          budget?: number
          start_date?: string
          end_date?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          status?: 'proposal' | 'active' | 'review' | 'completed' | 'on-hold' | 'cancelled'
          client_id: string
          budget?: number
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'proposal' | 'active' | 'review' | 'completed' | 'on-hold' | 'cancelled'
          client_id?: string
          budget?: number
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          subject: string
          content: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          read: boolean
          project_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          subject: string
          content: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          read?: boolean
          project_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          subject?: string
          content?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          read?: boolean
          project_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          client_id: string
          project_id?: string
          amount: number
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string
          issued_date: string
          paid_date?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          client_id: string
          project_id?: string
          amount: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string
          issued_date?: string
          paid_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          client_id?: string
          project_id?: string
          amount?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string
          issued_date?: string
          paid_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      feedbacks: {
        Row: {
          id: string
          client_id: string
          project_id?: string
          title: string
          description: string
          status: 'pending' | 'in_progress' | 'resolved' | 'closed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          project_id?: string
          title: string
          description: string
          status?: 'pending' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          project_id?: string
          title?: string
          description?: string
          status?: 'pending' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description?: string
          status: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id?: string
          due_date?: string
          completed_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string
          status?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id?: string
          due_date?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string
          status?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id?: string
          due_date?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_phases: {
        Row: {
          id: string
          project_id: string
          name: string
          description?: string
          start_date?: string
          end_date?: string
          status: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string
          start_date?: string
          end_date?: string
          status?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string
          start_date?: string
          end_date?: string
          status?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          phase_id: string
          title: string
          description?: string
          due_date?: string
          completed_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          phase_id: string
          title: string
          description?: string
          due_date?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          phase_id?: string
          title?: string
          description?: string
          due_date?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      file_uploads: {
        Row: {
          id: string
          user_id: string
          project_id?: string
          filename: string
          original_name: string
          file_path: string
          file_size: number
          mime_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string
          filename: string
          original_name: string
          file_path: string
          file_size: number
          mime_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          filename?: string
          original_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          client_id: string
          appointment_type: string
          scheduled_date: string
          duration: number
          status: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          appointment_type: string
          scheduled_date: string
          duration?: number
          status?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          appointment_type?: string
          scheduled_date?: string
          duration?: number
          status?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      budget_estimates: {
        Row: {
          id: string
          client_id: string
          project_type: string
          project_complexity: string
          features: any
          total_cost: number
          timeframe: any
          configuration: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          project_type: string
          project_complexity: string
          features: any
          total_cost: number
          timeframe: any
          configuration: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          project_type?: string
          project_complexity?: string
          features?: any
          total_cost?: number
          timeframe?: any
          configuration?: any
          created_at?: string
          updated_at?: string
        }
      }
      technology_recommendations: {
        Row: {
          id: string
          user_id: string
          project_types: string[]
          priorities: string[]
          experience_level: string
          budget: number
          timeline: number
          team_size: number
          recommendations: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_types: string[]
          priorities: string[]
          experience_level: string
          budget: number
          timeline: number
          team_size: number
          recommendations: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_types?: string[]
          priorities?: string[]
          experience_level?: string
          budget?: number
          timeline?: number
          team_size?: number
          recommendations?: any
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          created_at?: string
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
      user_role: 'admin' | 'client'
      project_status: 'proposal' | 'active' | 'review' | 'completed' | 'on-hold' | 'cancelled'
      message_priority: 'low' | 'medium' | 'high' | 'urgent'
      invoice_status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
      feedback_status: 'pending' | 'in_progress' | 'resolved' | 'closed'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export function getSupabaseUrl() {
  return process.env.SUPABASE_SERVER_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
}

const supabaseUrl = getSupabaseUrl()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabaseInstance: SupabaseClient<Database> | null = null

export const supabase: SupabaseClient<Database> = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
})()

// Alias pour la compatibilité
export const supabaseClient = supabase
