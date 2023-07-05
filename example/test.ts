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
