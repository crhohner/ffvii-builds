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
      accessory: {
        Row: {
          description: string | null
          games: string[]
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          games: string[]
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          games?: string[]
          id?: string
          name?: string
        }
        Relationships: []
      }
      build: {
        Row: {
          accessory: string
          armor_materia: string[]
          armor_schema: string
          character: Database["public"]["Enums"]["character"]
          description: string | null
          game: Database["public"]["Enums"]["game"]
          id: string
          name: string
          summon_materia: string | null
          user: string
          weapon_materia: string[]
          weapon_schema: string
        }
        Insert: {
          accessory: string
          armor_materia: string[]
          armor_schema: string
          character: Database["public"]["Enums"]["character"]
          description?: string | null
          game: Database["public"]["Enums"]["game"]
          id?: string
          name: string
          summon_materia?: string | null
          user: string
          weapon_materia: string[]
          weapon_schema: string
        }
        Update: {
          accessory?: string
          armor_materia?: string[]
          armor_schema?: string
          character?: Database["public"]["Enums"]["character"]
          description?: string | null
          game?: Database["public"]["Enums"]["game"]
          id?: string
          name?: string
          summon_materia?: string | null
          user?: string
          weapon_materia?: string[]
          weapon_schema?: string
        }
        Relationships: [
          {
            foreignKeyName: "build_accessory_accessory_id_fk"
            columns: ["accessory"]
            isOneToOne: false
            referencedRelation: "accessory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_armor_schema_schema_id_fk"
            columns: ["armor_schema"]
            isOneToOne: false
            referencedRelation: "schema"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_weapon_schema_schema_id_fk"
            columns: ["weapon_schema"]
            isOneToOne: false
            referencedRelation: "schema"
            referencedColumns: ["id"]
          },
        ]
      }
      materia: {
        Row: {
          description: string | null
          games: Database["public"]["Enums"]["game"][]
          id: string
          materia_type: Database["public"]["Enums"]["materia_type"]
          name: string
        }
        Insert: {
          description?: string | null
          games: Database["public"]["Enums"]["game"][]
          id?: string
          materia_type: Database["public"]["Enums"]["materia_type"]
          name: string
        }
        Update: {
          description?: string | null
          games?: Database["public"]["Enums"]["game"][]
          id?: string
          materia_type?: Database["public"]["Enums"]["materia_type"]
          name?: string
        }
        Relationships: []
      }
      materia_link: {
        Row: {
          blue_id: string
          target_id: string
        }
        Insert: {
          blue_id: string
          target_id: string
        }
        Update: {
          blue_id?: string
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materia_link_blue_id_materia_id_fk"
            columns: ["blue_id"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materia_link_target_id_materia_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id"]
          },
        ]
      }
      party: {
        Row: {
          description: string | null
          game: Database["public"]["Enums"]["game"]
          id: string
          leader: string
          name: string
          second: string
          third: string | null
          user: string
        }
        Insert: {
          description?: string | null
          game: Database["public"]["Enums"]["game"]
          id?: string
          leader: string
          name: string
          second: string
          third?: string | null
          user: string
        }
        Update: {
          description?: string | null
          game?: Database["public"]["Enums"]["game"]
          id?: string
          leader?: string
          name?: string
          second?: string
          third?: string | null
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_leader_build_id_fk"
            columns: ["leader"]
            isOneToOne: false
            referencedRelation: "build"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "party_second_build_id_fk"
            columns: ["second"]
            isOneToOne: false
            referencedRelation: "build"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "party_third_build_id_fk"
            columns: ["third"]
            isOneToOne: false
            referencedRelation: "build"
            referencedColumns: ["id"]
          },
        ]
      }
      schema: {
        Row: {
          id: string
          name: string
          slots: Database["public"]["Enums"]["slot_type"][]
          user: string
        }
        Insert: {
          id?: string
          name: string
          slots: Database["public"]["Enums"]["slot_type"][]
          user: string
        }
        Update: {
          id?: string
          name?: string
          slots?: Database["public"]["Enums"]["slot_type"][]
          user?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      character:
        | "cloud"
        | "barret"
        | "tifa"
        | "aerith"
        | "red-xiii"
        | "yuffie"
        | "cait-sith"
        | "cid"
        | "vincent"
      game: "og" | "remake" | "rebirth"
      materia_type: "red" | "yellow" | "green" | "blue" | "purple"
      slot_type: "single" | "double"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
