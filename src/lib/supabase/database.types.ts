export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string
          student_id: string | null
          name: string
          phone: string | null
          gender: 'male' | 'female' | 'other' | null
          ideal_career: string | null
          career_custom: string | null
          personality_type: string | null
          learning_goals: Json | null
          interests: Json | null
          skills_assessment: Json | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          student_id?: string | null
          name: string
          phone?: string | null
          gender?: 'male' | 'female' | 'other' | null
          ideal_career?: string | null
          career_custom?: string | null
          personality_type?: string | null
          learning_goals?: Json | null
          interests?: Json | null
          skills_assessment?: Json | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          student_id?: string | null
          name?: string
          phone?: string | null
          gender?: 'male' | 'female' | 'other' | null
          ideal_career?: string | null
          career_custom?: string | null
          personality_type?: string | null
          learning_goals?: Json | null
          interests?: Json | null
          skills_assessment?: Json | null
          photo_url?: string | null
          updated_at?: string
        }
      }
      future_predictions: {
        Row: {
          id: string
          user_id: string
          graduate_image_url: string | null
          career_image_url: string | null
          graduate_achievements: Json | null
          career_achievements: Json | null
          skill_radar_data: Json | null
          growth_path: Json | null
          confidence_score: number | null
          processing_status: 'pending' | 'processing' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          graduate_image_url?: string | null
          career_image_url?: string | null
          graduate_achievements?: Json | null
          career_achievements?: Json | null
          skill_radar_data?: Json | null
          growth_path?: Json | null
          confidence_score?: number | null
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          graduate_image_url?: string | null
          career_image_url?: string | null
          graduate_achievements?: Json | null
          career_achievements?: Json | null
          skill_radar_data?: Json | null
          growth_path?: Json | null
          confidence_score?: number | null
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          updated_at?: string
        }
      }
      shares: {
        Row: {
          id: string
          user_id: string
          platform: string
          share_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          share_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          share_url?: string | null
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
  }
}