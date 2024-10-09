

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
          accessory: string | null
          armor_materia: string[]
          armor_name: string | null
          armor_schema: Database["public"]["Enums"]["slot_type"][]
          character: Database["public"]["Enums"]["character"]
          id: string
          summon_materia: string | null
          user_id: string
          weapon_materia: string[]
          weapon_name: string | null
          weapon_schema: Database["public"]["Enums"]["slot_type"][]
        }
        Insert: {
          accessory?: string | null
          armor_materia: string[]
          armor_name?: string | null
          armor_schema: Database["public"]["Enums"]["slot_type"][]
          character: Database["public"]["Enums"]["character"]
          id?: string
          summon_materia?: string | null
          user_id: string
          weapon_materia: string[]
          weapon_name?: string | null
          weapon_schema: Database["public"]["Enums"]["slot_type"][]
        }
        Update: {
          accessory?: string | null
          armor_materia?: string[]
          armor_name?: string | null
          armor_schema?: Database["public"]["Enums"]["slot_type"][]
          character?: Database["public"]["Enums"]["character"]
          id?: string
          summon_materia?: string | null
          user_id?: string
          weapon_materia?: string[]
          weapon_name?: string | null
          weapon_schema?: Database["public"]["Enums"]["slot_type"][]
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
            foreignKeyName: "build_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
          builds: string[]
          description: string | null
          game: Database["public"]["Enums"]["game"]
          id: string
          name: string
          user_id: string
        }
        Insert: {
          builds: string[]
          description?: string | null
          game: Database["public"]["Enums"]["game"]
          id?: string
          name: string
          user_id: string
        }
        Update: {
          builds?: string[]
          description?: string | null
          game?: Database["public"]["Enums"]["game"]
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
