import { supabase } from '../lib/supabase';

interface NLPProcessResult {
  transcriptId: string;
  medicalAnalysis: any;
  sentimentAnalysis: any;
  soapNote: any;
}

export async function processTranscript(
  transcript: string,
  patientName: string
): Promise<NLPProcessResult> {
  const { data: transcriptData, error: transcriptError } = await supabase
    .from('transcripts')
    .insert({
      patient_name: patientName,
      raw_text: transcript,
    })
    .select()
    .maybeSingle();

  if (transcriptError || !transcriptData) {
    throw new Error('Failed to save transcript: ' + transcriptError?.message);
  }

  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medical-nlp-processor`;
  const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ transcript, patientName }),
  });

  if (!response.ok) {
    throw new Error('Failed to process transcript with NLP');
  }

  const result = await response.json();

  const { data: medicalData, error: medicalError } = await supabase
    .from('medical_analysis')
    .insert({
      transcript_id: transcriptData.id,
      symptoms: result.medicalAnalysis.symptoms,
      diagnosis: result.medicalAnalysis.diagnosis,
      treatment: result.medicalAnalysis.treatment,
      current_status: result.medicalAnalysis.currentStatus,
      prognosis: result.medicalAnalysis.prognosis,
      keywords: result.medicalAnalysis.keywords,
    })
    .select()
    .maybeSingle();

  if (medicalError) {
    console.error('Failed to save medical analysis:', medicalError);
  }

  const { data: sentimentData, error: sentimentError } = await supabase
    .from('sentiment_analysis')
    .insert({
      transcript_id: transcriptData.id,
      patient_sentiment: result.sentimentAnalysis.sentiment,
      intent: result.sentimentAnalysis.intent,
      confidence_score: result.sentimentAnalysis.confidence,
    })
    .select()
    .maybeSingle();

  if (sentimentError) {
    console.error('Failed to save sentiment analysis:', sentimentError);
  }

  const { data: soapData, error: soapError } = await supabase
    .from('soap_notes')
    .insert({
      transcript_id: transcriptData.id,
      subjective: result.soapNote.subjective,
      objective: result.soapNote.objective,
      assessment: result.soapNote.assessment,
      plan: result.soapNote.plan,
    })
    .select()
    .maybeSingle();

  if (soapError) {
    console.error('Failed to save SOAP note:', soapError);
  }

  return {
    transcriptId: transcriptData.id,
    medicalAnalysis: medicalData,
    sentimentAnalysis: sentimentData,
    soapNote: soapData,
  };
}

export async function getTranscriptById(transcriptId: string) {
  const { data: transcript, error: transcriptError } = await supabase
    .from('transcripts')
    .select('*')
    .eq('id', transcriptId)
    .maybeSingle();

  if (transcriptError) {
    throw new Error('Failed to fetch transcript');
  }

  const { data: medical } = await supabase
    .from('medical_analysis')
    .select('*')
    .eq('transcript_id', transcriptId)
    .maybeSingle();

  const { data: sentiment } = await supabase
    .from('sentiment_analysis')
    .select('*')
    .eq('transcript_id', transcriptId)
    .maybeSingle();

  const { data: soap } = await supabase
    .from('soap_notes')
    .select('*')
    .eq('transcript_id', transcriptId)
    .maybeSingle();

  return {
    transcript,
    medical,
    sentiment,
    soap,
  };
}

export async function getAllTranscripts() {
  const { data, error } = await supabase
    .from('transcripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch transcripts');
  }

  return data;
}
