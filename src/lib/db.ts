import { PGlite } from '@electric-sql/pglite';
import { electricSync } from '@electric-sql/pglite-sync';

// Bumped to v4 to completely sidestep the HMR corruption
export const pg = new PGlite('idb://vetaura-vault-v4', {
  extensions: {
    sync: electricSync(),
  },
});

export const db = {
  pg,
  query: async (queryText: string, params?: any[]) => {
    await pg.waitReady;
    return await pg.query(queryText, params);
  },
  get waitReady() {
    return pg.waitReady;
  }
};

pg.waitReady.then(() => {
  pg.exec(`
    CREATE TABLE IF NOT EXISTS animals (
      id uuid PRIMARY KEY,
      entity_type text,
      parent_mob_id uuid,
      census_count integer,
      name text,
      species text,
      latin_name text,
      category text,
      location text,
      image_url text,
      distribution_map_url text,
      hazard_rating text,
      is_venomous boolean DEFAULT false,
      weight_unit text,
      flying_weight_g numeric,
      winter_weight_g numeric,
      average_target_weight numeric,
      date_of_birth date,
      is_dob_unknown boolean DEFAULT false,
      gender text,
      microchip_id text,
      ring_number text,
      has_no_id boolean DEFAULT false,
      red_list_status text,
      description text,
      special_requirements text,
      critical_husbandry_notes text,
      ambient_temp_only boolean DEFAULT false,
      target_day_temp_c numeric,
      target_night_temp_c numeric,
      water_tipping_temp numeric,
      target_humidity_min_percent numeric,
      target_humidity_max_percent numeric,
      misting_frequency text,
      acquisition_date date,
      acquisition_type text,
      origin text,
      origin_location text,
      lineage_unknown boolean DEFAULT false,
      sire_id uuid,
      dam_id uuid,
      is_boarding boolean DEFAULT false,
      is_quarantine boolean DEFAULT false,
      display_order integer,
      archived boolean DEFAULT false,
      archive_reason text,
      archive_type text,
      archived_at timestamp with time zone,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now(),
      sign_content text
    );

    CREATE TABLE IF NOT EXISTS clinical_attachments (
      id uuid PRIMARY KEY,
      record_id uuid,
      file_name text,
      file_type text,
      file_url text,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      created_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS clinical_records (
      id uuid PRIMARY KEY,
      animal_id uuid,
      record_type text,
      record_date timestamp with time zone DEFAULT now(),
      soap_subjective text,
      soap_objective text,
      soap_assessment text,
      soap_plan text,
      weight_grams numeric,
      conductor_role text,
      conducted_by uuid,
      external_vet_name text,
      external_vet_clinic text,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS clinical_schedule (
      id uuid PRIMARY KEY,
      animal_id uuid,
      schedule_type text,
      title text,
      start_date date,
      end_date date,
      frequency text,
      status text DEFAULT 'ACTIVE',
      assigned_to uuid,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS daily_logs (
      id uuid PRIMARY KEY,
      animal_id uuid,
      log_type text,
      log_date timestamp with time zone,
      notes text,
      weight_grams numeric,
      weight_unit text,
      basking_temp_c numeric,
      cool_temp_c numeric,
      temperature_c numeric,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS daily_rounds (
      id uuid PRIMARY KEY,
      animal_id uuid,
      date date,
      shift text,
      section text,
      is_alive boolean,
      water_checked boolean,
      locks_secured boolean,
      animal_issue_note text,
      general_section_note text,
      completed_by uuid,
      completed_at timestamp with time zone,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS feeding_schedules (
      id uuid PRIMARY KEY,
      animal_id uuid,
      scheduled_date date,
      food_type text,
      quantity numeric,
      calci_dust boolean DEFAULT false,
      additional_notes text,
      is_completed boolean DEFAULT false,
      completed_at timestamp with time zone,
      completed_by uuid,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now(),
      next_feed_date date,
      interval_days integer DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS fire_drill_logs (
      id uuid PRIMARY KEY,
      drill_date timestamp with time zone DEFAULT now(),
      drill_type text,
      areas_involved text,
      evacuation_duration text,
      roll_call_completed boolean DEFAULT false,
      issues_observed text,
      corrective_actions text,
      status text,
      conducted_by uuid,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id uuid PRIMARY KEY,
      incident_date timestamp with time zone DEFAULT now(),
      person_involved_name text,
      person_type text,
      location text,
      incident_description text,
      injury_details text,
      treatment_provided text,
      outcome text,
      is_riddor_reportable boolean DEFAULT false,
      witness_details text,
      animal_involved boolean DEFAULT false,
      linked_animal_id uuid,
      assigned_to uuid,
      reported_by uuid,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS isolation_logs (
      id uuid PRIMARY KEY,
      animal_id uuid,
      isolation_type text,
      start_date date DEFAULT CURRENT_DATE,
      end_date date,
      location text,
      reason_notes text,
      status text DEFAULT 'ACTIVE',
      authorized_by uuid,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS maintenance_tickets (
      id uuid PRIMARY KEY,
      title text,
      description text,
      category text,
      status text,
      priority text,
      location text,
      equipment_tag text,
      assigned_to uuid,
      reported_by uuid,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS medication_logs (
      id uuid PRIMARY KEY,
      schedule_id uuid,
      animal_id uuid,
      administered_at timestamp with time zone DEFAULT now(),
      status text,
      notes text,
      administered_by uuid,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS operational_lists (
      id uuid PRIMARY KEY,
      name text,
      description text,
      category text,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      id uuid PRIMARY KEY,
      role text,
      permission text
    );

    CREATE TABLE IF NOT EXISTS safety_incidents (
      id uuid PRIMARY KEY,
      incident_date timestamp with time zone DEFAULT now(),
      title text,
      incident_type text,
      severity_level text,
      location text,
      description text,
      immediate_action_taken text,
      animal_involved boolean DEFAULT false,
      linked_animal_id uuid,
      first_aid_required boolean DEFAULT false,
      root_cause text,
      preventative_action text,
      status text,
      reported_by uuid,
      assigned_to uuid,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id uuid PRIMARY KEY,
      title text,
      description text,
      assigned_to uuid,
      due_date date,
      task_type text,
      status text DEFAULT 'PENDING',
      completed_at timestamp with time zone,
      completed_by uuid,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now(),
      location text,
      priority text DEFAULT 'MEDIUM'
    );

    CREATE TABLE IF NOT EXISTS timesheets (
      id uuid PRIMARY KEY,
      user_id uuid,
      shift_date date,
      clock_in_time timestamp with time zone DEFAULT now(),
      clock_out_time timestamp with time zone,
      status text,
      notes text,
      is_deleted boolean DEFAULT false,
      created_by uuid,
      modified_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY,
      email text,
      name text,
      initials text,
      role text DEFAULT 'STAFF',
      is_deleted boolean DEFAULT false,
      created_at timestamp with time zone DEFAULT now()
    );
  `).catch(console.error);
});