type Tags = { tag_name: string; hex_color: string };

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
      todos: {
        Row: {
          id: number;
          inserted_at: string;
          is_complete: boolean | null;
          task: string | null;
          user_id: string;
          tags: Tags[];
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          is_complete?: boolean | null;
          task?: string | null;
          user_id: string;
          tags: Tags[];
        };
        Update: {
          id?: number;
          inserted_at?: string;
          is_complete?: boolean | null;
          task?: string | null;
          user_id?: string;
          tags: Tags[];
        };
        Relationships: [
          {
            foreignKeyName: 'todos_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
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
export type Todos = Database['public']['Tables']['todos']['Row'];
export type InsertTodos = Database['public']['Tables']['todos']['Insert'];
export type UpdateTodos = Database['public']['Tables']['todos']['Update'];
