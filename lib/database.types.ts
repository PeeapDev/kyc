export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          phone_number: string | null;
          role: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          email: string;
          phone_number?: string | null;
          role?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string;
          phone_number?: string | null;
          role?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      dashboard_settings: {
        Row: {
          id: string;
          user_id: string;
          logo_url: string | null;
          title: string | null;
          theme: string;
          time_format: string;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          logo_url?: string | null;
          title?: string | null;
          theme?: string;
          time_format?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          logo_url?: string | null;
          title?: string | null;
          theme?: string;
          time_format?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      queue_items: {
        Row: {
          id: string;
          name: string;
          phone_number: string;
          status: 'waiting' | 'in-progress' | 'completed';
          joined_at: string;
          completed_at: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          name: string;
          phone_number: string;
          status?: 'waiting' | 'in-progress' | 'completed';
          joined_at?: string;
          completed_at?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          name?: string;
          phone_number?: string;
          status?: 'waiting' | 'in-progress' | 'completed';
          joined_at?: string;
          completed_at?: string | null;
          metadata?: Json;
        };
      };
      kyc_applications: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'approved' | 'rejected';
          documents: Json;
          submitted_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: 'pending' | 'approved' | 'rejected';
          documents?: Json;
          submitted_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'pending' | 'approved' | 'rejected';
          documents?: Json;
          submitted_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 