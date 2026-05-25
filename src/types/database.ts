// ============================================================
// Database types — auto-generated from schema
// Keep in sync with supabase/migrations/001_init.sql
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------------------------------------------------------------------------
// Enums / union types
// ---------------------------------------------------------------------------

export type UserRole       = 'admin' | 'superadmin';
export type PropertyTipe   = 'Ruko' | 'Villa';
export type PropertyStatus = 'in_stock' | 'sold_out';
export type PropertySiap   = 'siap_huni' | 'siap_kosong' | 'siap_huni_renovasi';
export type AuditAction    = 'create' | 'update' | 'delete';

// ---------------------------------------------------------------------------
// Row types (what you get back from SELECT)
// ---------------------------------------------------------------------------

export interface ProfileRow {
  id:         string;         // UUID
  email:      string;
  role:       UserRole;
  is_active:  boolean;
  created_at: string;         // TIMESTAMPTZ → ISO string
}

export interface PropertyRow {
  id:            string;
  nama_property: string;
  group_name:    string | null;
  lebar:         number;
  panjang:       number;
  hadap:         string[];
  tipe:          PropertyTipe;
  tingkat:       number;
  price:         number;
  carport:       boolean;
  status:        PropertyStatus;
  siap:          PropertySiap;
  maps_link:     string | null;
  kawasan:       string[];
  unit:          string | null;
  created_at:    string;
  updated_at:    string;
  created_by:    string | null; // UUID → profiles.id
  deleted_at:    string | null;
}

export interface AuditLogRow {
  id:             string;
  property_id:    string | null;
  user_id:        string | null;
  action:         AuditAction;
  changed_fields: Json | null;
  created_at:     string;
}

// ---------------------------------------------------------------------------
// Insert types (what you send in an INSERT — optional auto-generated fields)
// ---------------------------------------------------------------------------

export type ProfileInsert = Omit<ProfileRow, 'created_at'> & {
  created_at?: string;
  is_active?:  boolean;
};

export type PropertyInsert = Omit<
  PropertyRow,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & {
  id?:         string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type AuditLogInsert = Omit<AuditLogRow, 'id' | 'created_at'> & {
  id?:         string;
  created_at?: string;
};

// ---------------------------------------------------------------------------
// Update types (all fields optional except identity)
// ---------------------------------------------------------------------------

export type PropertyUpdate = Partial<PropertyInsert>;
export type ProfileUpdate  = Partial<Omit<ProfileInsert, 'id'>>;

// ---------------------------------------------------------------------------
// Full Database schema type (for typed Supabase client)
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row:    ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      properties: {
        Row:    PropertyRow;
        Insert: PropertyInsert;
        Update: PropertyUpdate;
      };
      audit_logs: {
        Row:    AuditLogRow;
        Insert: AuditLogInsert;
        Update: Partial<AuditLogInsert>;
      };
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role:        UserRole;
      property_tipe:    PropertyTipe;
      property_status:  PropertyStatus;
      property_siap:    PropertySiap;
      audit_action:     AuditAction;
    };
  };
}
