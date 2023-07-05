type LevelRanks = { role_id: string; level: number };

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      guild: {
        Row: {
          guild_id: string;
          id: number;
          level_message_channel: string | null;
          level_message_channels: string[];
          level_ranks: Json[];
          mod_id: string | null;
          mod_log_channel: string | null;
          pat: number;
        };
        Insert: {
          guild_id: string;
          id?: number;
          level_message_channel?: string | null;
          level_message_channels?: string[];
          level_ranks?: Json[];
          mod_id?: string | null;
          mod_log_channel?: string | null;
          pat?: number;
        };
        Update: {
          guild_id?: string;
          id?: number;
          level_message_channel?: string | null;
          level_message_channels?: string[];
          level_ranks?: Json[];
          mod_id?: string | null;
          mod_log_channel?: string | null;
          pat?: number;
        };
        Relationships: [];
      };
      member: {
        Row: {
          guild_id: string;
          id: number;
          last_message_timestamp: number;
          last_pat_timestamp: number;
          level: number;
          member_id: string;
          message: number;
          pat: number;
          xp: number;
        };
        Insert: {
          guild_id: string;
          id?: number;
          last_message_timestamp?: number;
          last_pat_timestamp?: number;
          level?: number;
          member_id: string;
          message?: number;
          pat?: number;
          xp?: number;
        };
        Update: {
          guild_id?: string;
          id?: number;
          last_message_timestamp?: number;
          last_pat_timestamp?: number;
          level?: number;
          member_id?: string;
          message?: number;
          pat?: number;
          xp?: number;
        };
        Relationships: [];
      };
      warning: {
        Row: {
          guild_id: string;
          id: string;
          member_id: string;
          mod_id: string;
          reason: string;
          timestamp: number;
        };
        Insert: {
          guild_id: string;
          id?: string;
          member_id: string;
          mod_id: string;
          reason: string;
          timestamp: number;
        };
        Update: {
          guild_id?: string;
          id?: string;
          member_id?: string;
          mod_id?: string;
          reason?: string;
          timestamp?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

//Schema: public
//Tables
export type Guild = Database['public']['Tables']['guild']['Row'];
export type InsertGuild = Database['public']['Tables']['guild']['Insert'];
export type UpdateGuild = Database['public']['Tables']['guild']['Update'];

export type Member = Database['public']['Tables']['member']['Row'];
export type InsertMember = Database['public']['Tables']['member']['Insert'];
export type UpdateMember = Database['public']['Tables']['member']['Update'];

export type Warning = Database['public']['Tables']['warning']['Row'];
export type InsertWarning = Database['public']['Tables']['warning']['Insert'];
export type UpdateWarning = Database['public']['Tables']['warning']['Update'];
