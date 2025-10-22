import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Transcript {
  id: string;
  patient_name: string;
  raw_text: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalAnalysis {
  id: string;
  transcript_id: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string[];
  current_status: string;
  prognosis: string;
  keywords: string[];
  created_at: string;
}

export interface SentimentAnalysis {
  id: string;
  transcript_id: string;
  patient_sentiment: string;
  intent: string;
  confidence_score: number;
  created_at: string;
}

export interface SOAPNote {
  id: string;
  transcript_id: string;
  subjective: {
    chief_complaint: string;
    history_of_present_illness: string;
  };
  objective: {
    physical_exam: string;
    observations: string;
  };
  assessment: {
    diagnosis: string;
    severity: string;
  };
  plan: {
    treatment: string;
    follow_up: string;
  };
  created_at: string;
}
