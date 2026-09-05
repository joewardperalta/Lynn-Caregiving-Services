-- PSW Services website database schema
-- Run this file against a PostgreSQL database after creating the database:
--   createdb psw_services
--   psql -d psw_services -f database/schema.sql

CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  preferred_contact_method VARCHAR(20),
  relationship_to_client VARCHAR(50) NOT NULL,
  client_age VARCHAR(20),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  support_types TEXT[] NOT NULL DEFAULT '{}',
  desired_start_date DATE,
  frequency VARCHAR(50),
  preferred_time VARCHAR(50),
  approximate_hours VARCHAR(80),
  additional_information TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries (status);
CREATE INDEX IF NOT EXISTS inquiries_email_idx ON inquiries (email);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages (created_at DESC);
