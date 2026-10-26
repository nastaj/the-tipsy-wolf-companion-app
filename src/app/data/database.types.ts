// GENERATED from the Supabase schema (supabase/migrations). Do not edit by hand;
// regenerate after schema changes.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  public: {
    Tables: {
      level_runs: {
        Row: {
          completed_at: string;
          gold: number;
          id: number;
          keeper_id: string;
          level_id: number;
          time_seconds: number;
        };
        Insert: {
          completed_at?: string;
          gold: number;
          id?: never;
          keeper_id: string;
          level_id: number;
          time_seconds: number;
        };
        Update: {
          completed_at?: string;
          gold?: number;
          id?: never;
          keeper_id?: string;
          level_id?: number;
          time_seconds?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'level_runs_keeper_id_fkey';
            columns: ['keeper_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'level_runs_level_id_fkey';
            columns: ['level_id'];
            isOneToOne: false;
            referencedRelation: 'levels';
            referencedColumns: ['id'];
          },
        ];
      };
      levels: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      market_items: {
        Row: {
          category: Database['public']['Enums']['market_category'];
          created_at: string;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          price: number;
        };
        Insert: {
          category: Database['public']['Enums']['market_category'];
          created_at?: string;
          id: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          price: number;
        };
        Update: {
          category?: Database['public']['Enums']['market_category'];
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          price?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          gold: number;
          id: string;
          keeper_name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          gold?: number;
          id: string;
          keeper_name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          gold?: number;
          id?: string;
          keeper_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          id: number;
          item_id: string;
          keeper_id: string;
          price_paid: number;
          purchased_at: string;
        };
        Insert: {
          id?: never;
          item_id: string;
          keeper_id: string;
          price_paid: number;
          purchased_at?: string;
        };
        Update: {
          id?: never;
          item_id?: string;
          keeper_id?: string;
          price_paid?: number;
          purchased_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'purchases_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'market_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'purchases_keeper_id_fkey';
            columns: ['keeper_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      reviews: {
        Row: {
          author: string;
          text: string;
          created_at: string;
          epithet: string | null;
          id: number;
          keeper_id: string;
          level_id: number;
          rating: number;
        };
        Insert: {
          author: string;
          text: string;
          created_at?: string;
          epithet?: string | null;
          id?: never;
          keeper_id: string;
          level_id: number;
          rating: number;
        };
        Update: {
          author?: string;
          text?: string;
          created_at?: string;
          epithet?: string | null;
          id?: never;
          keeper_id?: string;
          level_id?: number;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_keeper_id_fkey';
            columns: ['keeper_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_level_id_fkey';
            columns: ['level_id'];
            isOneToOne: false;
            referencedRelation: 'levels';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      leaderboard: {
        Row: {
          completed_at: string | null;
          gold: number | null;
          keeper_id: string | null;
          keeper_name: string | null;
          level_id: number | null;
          rank: number | null;
          time_seconds: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'level_runs_keeper_id_fkey';
            columns: ['keeper_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'level_runs_level_id_fkey';
            columns: ['level_id'];
            isOneToOne: false;
            referencedRelation: 'levels';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      purchase_item: { Args: { p_item_id: string }; Returns: number };
    };
    Enums: {
      market_category: 'resource' | 'amenity' | 'upgrade';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      market_category: ['resource', 'amenity', 'upgrade'],
    },
  },
};
