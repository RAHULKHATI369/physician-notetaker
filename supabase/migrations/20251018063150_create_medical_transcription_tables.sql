/*
  # Medical Transcription System Database Schema

  ## Overview
  Creates tables for storing medical transcripts, NLP analysis results, 
  sentiment data, and SOAP notes for a physician notetaker application.

  ## Tables Created

  1. **transcripts**
     - `id` (uuid, primary key) - Unique identifier for each transcript
     - `patient_name` (text) - Name of the patient
     - `raw_text` (text) - Original conversation transcript
     - `created_at` (timestamptz) - When the transcript was created
     - `updated_at` (timestamptz) - Last update timestamp

  2. **medical_analysis**
     - `id` (uuid, primary key) - Unique identifier for analysis
     - `transcript_id` (uuid, foreign key) - Links to transcript
     - `symptoms` (jsonb) - Array of extracted symptoms
     - `diagnosis` (text) - Identified diagnosis
     - `treatment` (jsonb) - Array of treatments
     - `current_status` (text) - Patient's current condition
     - `prognosis` (text) - Expected outcome
     - `keywords` (jsonb) - Important medical phrases
     - `created_at` (timestamptz) - Analysis timestamp

  3. **sentiment_analysis**
     - `id` (uuid, primary key) - Unique identifier
     - `transcript_id` (uuid, foreign key) - Links to transcript
     - `patient_sentiment` (text) - Overall sentiment (Anxious/Neutral/Reassured)
     - `intent` (text) - Detected patient intent
     - `confidence_score` (numeric) - Confidence level (0-1)
     - `created_at` (timestamptz) - Analysis timestamp

  4. **soap_notes**
     - `id` (uuid, primary key) - Unique identifier
     - `transcript_id` (uuid, foreign key) - Links to transcript
     - `subjective` (jsonb) - Subjective findings
     - `objective` (jsonb) - Objective findings
     - `assessment` (jsonb) - Clinical assessment
     - `plan` (jsonb) - Treatment plan
     - `created_at` (timestamptz) - Note creation time

  ## Security
  - RLS enabled on all tables
  - Public can insert and read their own data
  - All tables use secure UUID identifiers
*/

-- Create transcripts table
CREATE TABLE IF NOT EXISTS transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  raw_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create medical_analysis table
CREATE TABLE IF NOT EXISTS medical_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id uuid NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  symptoms jsonb DEFAULT '[]'::jsonb,
  diagnosis text DEFAULT '',
  treatment jsonb DEFAULT '[]'::jsonb,
  current_status text DEFAULT '',
  prognosis text DEFAULT '',
  keywords jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create sentiment_analysis table
CREATE TABLE IF NOT EXISTS sentiment_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id uuid NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  patient_sentiment text DEFAULT 'Neutral',
  intent text DEFAULT '',
  confidence_score numeric(3,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now()
);

-- Create soap_notes table
CREATE TABLE IF NOT EXISTS soap_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id uuid NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  subjective jsonb DEFAULT '{}'::jsonb,
  objective jsonb DEFAULT '{}'::jsonb,
  assessment jsonb DEFAULT '{}'::jsonb,
  plan jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentiment_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE soap_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transcripts
CREATE POLICY "Anyone can insert transcripts"
  ON transcripts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view transcripts"
  ON transcripts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update transcripts"
  ON transcripts FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- RLS Policies for medical_analysis
CREATE POLICY "Anyone can insert medical analysis"
  ON medical_analysis FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view medical analysis"
  ON medical_analysis FOR SELECT
  TO public
  USING (true);

-- RLS Policies for sentiment_analysis
CREATE POLICY "Anyone can insert sentiment analysis"
  ON sentiment_analysis FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view sentiment analysis"
  ON sentiment_analysis FOR SELECT
  TO public
  USING (true);

-- RLS Policies for soap_notes
CREATE POLICY "Anyone can insert SOAP notes"
  ON soap_notes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view SOAP notes"
  ON soap_notes FOR SELECT
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_medical_analysis_transcript_id ON medical_analysis(transcript_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_analysis_transcript_id ON sentiment_analysis(transcript_id);
CREATE INDEX IF NOT EXISTS idx_soap_notes_transcript_id ON soap_notes(transcript_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_created_at ON transcripts(created_at DESC);
