export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exercises: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_favorite: boolean | null
          muscle_group: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          muscle_group: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          muscle_group?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      routine_exercises: {
        Row: {
          created_at: string
          distance: number | null
          distance_unit: string | null
          duration: number | null
          duration_unit: string | null
          exercise_id: string
          id: string
          is_superset: boolean | null
          mav: boolean | null
          notes: string | null
          order_index: number
          reps: number | null
          rest_time: number | null
          routine_id: string
          rpe: number | null
          sets: number
          superset_group: number | null
          tracking_type: string
          warmup: boolean | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          created_at?: string
          distance?: number | null
          distance_unit?: string | null
          duration?: number | null
          duration_unit?: string | null
          exercise_id: string
          id?: string
          is_superset?: boolean | null
          mav?: boolean | null
          notes?: string | null
          order_index?: number
          reps?: number | null
          rest_time?: number | null
          routine_id: string
          rpe?: number | null
          sets?: number
          superset_group?: number | null
          tracking_type?: string
          warmup?: boolean | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          created_at?: string
          distance?: number | null
          distance_unit?: string | null
          duration?: number | null
          duration_unit?: string | null
          exercise_id?: string
          id?: string
          is_superset?: boolean | null
          mav?: boolean | null
          notes?: string | null
          order_index?: number
          reps?: number | null
          rest_time?: number | null
          routine_id?: string
          rpe?: number | null
          sets?: number
          superset_group?: number | null
          tracking_type?: string
          warmup?: boolean | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routine_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_exercises_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          assigned_days: string[] | null
          calculated_volume: number | null
          created_at: string
          created_by: string
          id: string
          is_assigned: boolean | null
          name: string
          type: string
          updated_at: string
          volume: string | null
        }
        Insert: {
          assigned_days?: string[] | null
          calculated_volume?: number | null
          created_at?: string
          created_by: string
          id?: string
          is_assigned?: boolean | null
          name: string
          type: string
          updated_at?: string
          volume?: string | null
        }
        Update: {
          assigned_days?: string[] | null
          calculated_volume?: number | null
          created_at?: string
          created_by?: string
          id?: string
          is_assigned?: boolean | null
          name?: string
          type?: string
          updated_at?: string
          volume?: string | null
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          actual_rpe: number | null
          created_at: string
          distance_completed: number | null
          duration_completed: number | null
          exercise_id: string
          id: string
          is_completed: boolean | null
          is_skipped: boolean | null
          notes: string | null
          reps_completed: number[] | null
          routine_exercise_id: string
          sets_completed: number | null
          weight_used: number[] | null
          weight_used_values: number[] | null
          workout_id: string
        }
        Insert: {
          actual_rpe?: number | null
          created_at?: string
          distance_completed?: number | null
          duration_completed?: number | null
          exercise_id: string
          id?: string
          is_completed?: boolean | null
          is_skipped?: boolean | null
          notes?: string | null
          reps_completed?: number[] | null
          routine_exercise_id: string
          sets_completed?: number | null
          weight_used?: number[] | null
          weight_used_values?: number[] | null
          workout_id: string
        }
        Update: {
          actual_rpe?: number | null
          created_at?: string
          distance_completed?: number | null
          duration_completed?: number | null
          exercise_id?: string
          id?: string
          is_completed?: boolean | null
          is_skipped?: boolean | null
          notes?: string | null
          reps_completed?: number[] | null
          routine_exercise_id?: string
          sets_completed?: number | null
          weight_used?: number[] | null
          weight_used_values?: number[] | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_routine_exercise_id_fkey"
            columns: ["routine_exercise_id"]
            isOneToOne: false
            referencedRelation: "routine_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          notes: string | null
          routine_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          routine_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          routine_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
