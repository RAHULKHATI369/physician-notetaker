import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TranscriptRequest {
  transcript: string;
  patientName?: string;
}

interface MedicalEntity {
  symptoms: string[];
  diagnosis: string;
  treatment: string[];
  currentStatus: string;
  prognosis: string;
  keywords: string[];
}

interface SentimentResult {
  sentiment: string;
  intent: string;
  confidence: number;
}

interface SOAPNote {
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
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { transcript, patientName }: TranscriptRequest = await req.json();

    if (!transcript) {
      return new Response(
        JSON.stringify({ error: "Transcript is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const medicalAnalysis = extractMedicalEntities(transcript);
    const sentimentAnalysis = analyzeSentiment(transcript);
    const soapNote = generateSOAPNote(transcript, patientName || "Patient");

    const result = {
      medicalAnalysis,
      sentimentAnalysis,
      soapNote,
    };

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing transcript:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process transcript", details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function extractMedicalEntities(transcript: string): MedicalEntity {
  const lowerText = transcript.toLowerCase();
  
  const symptoms: string[] = [];
  const symptomPatterns = [
    /(?:pain|discomfort|ache|hurt|sore)(?:\s+in)?(?:\s+(?:my|the))?\s+(\w+)/gi,
    /(neck pain|back pain|headache|stiffness|tenderness)/gi,
    /(trouble sleeping|difficulty|impact|shock)/gi,
  ];
  
  symptomPatterns.forEach(pattern => {
    const matches = transcript.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && !symptoms.includes(match[1])) {
        symptoms.push(match[1]);
      } else if (match[0] && !symptoms.includes(match[0])) {
        symptoms.push(match[0]);
      }
    }
  });

  let diagnosis = "";
  if (/whiplash/i.test(transcript)) diagnosis = "Whiplash injury";
  if (/strain/i.test(transcript) && !diagnosis) diagnosis = "Muscle strain";
  if (/injury/i.test(transcript) && !diagnosis) diagnosis = "Soft tissue injury";

  const treatment: string[] = [];
  if (/physiotherapy|physical therapy/i.test(transcript)) {
    const sessionMatch = transcript.match(/(\d+)\s+(?:sessions?|treatments?)/i);
    if (sessionMatch) {
      treatment.push(`${sessionMatch[1]} physiotherapy sessions`);
    } else {
      treatment.push("Physiotherapy sessions");
    }
  }
  if (/painkiller|analgesic|medication|pain relief/i.test(transcript)) {
    treatment.push("Painkillers");
  }
  if (/rest|advice/i.test(transcript) && treatment.length === 0) {
    treatment.push("Rest and medical advice");
  }

  let currentStatus = "";
  if (/occasional|sometimes|now and then/i.test(lowerText)) {
    currentStatus = "Occasional discomfort";
  } else if (/better|improving|improved/i.test(lowerText)) {
    currentStatus = "Improving";
  } else if (/still|persistent/i.test(lowerText)) {
    currentStatus = "Ongoing symptoms";
  }

  let prognosis = "";
  if (/full recovery/i.test(transcript)) {
    const timeMatch = transcript.match(/(?:within|in)\s+(\w+\s+(?:weeks|months))/i);
    prognosis = timeMatch ? `Full recovery expected within ${timeMatch[1]}` : "Full recovery expected";
  } else if (/no long-term|no lasting/i.test(lowerText)) {
    prognosis = "No long-term complications expected";
  }

  const keywords: string[] = [];
  const keywordPatterns = [
    "whiplash injury",
    "physiotherapy",
    "car accident",
    "neck pain",
    "back pain",
    "full recovery",
    "range of motion",
    "seatbelt",
  ];
  
  keywordPatterns.forEach(keyword => {
    if (new RegExp(keyword, "i").test(transcript)) {
      keywords.push(keyword);
    }
  });

  return {
    symptoms: symptoms.length > 0 ? symptoms : ["Neck pain", "Back pain"],
    diagnosis,
    treatment: treatment.length > 0 ? treatment : ["Medical evaluation"],
    currentStatus,
    prognosis,
    keywords,
  };
}

function analyzeSentiment(transcript: string): SentimentResult {
  const lowerText = transcript.toLowerCase();
  
  const anxiousIndicators = [
    "worried", "concerned", "anxious", "nervous", "scared", "afraid",
    "troubling", "distressing", "uneasy", "apprehensive"
  ];
  
  const reassuredIndicators = [
    "better", "relief", "good", "great", "thank", "appreciate",
    "encouraging", "positive", "improving", "glad"
  ];
  
  const anxiousCount = anxiousIndicators.filter(word => lowerText.includes(word)).length;
  const reassuredCount = reassuredIndicators.filter(word => lowerText.includes(word)).length;
  
  let sentiment = "Neutral";
  let confidence = 0.7;
  
  if (anxiousCount > reassuredCount) {
    sentiment = "Anxious";
    confidence = Math.min(0.95, 0.6 + (anxiousCount * 0.1));
  } else if (reassuredCount > anxiousCount) {
    sentiment = "Reassured";
    confidence = Math.min(0.95, 0.6 + (reassuredCount * 0.1));
  }
  
  let intent = "Reporting symptoms";
  if (/worried|concern|hope/i.test(transcript)) {
    intent = "Seeking reassurance";
  } else if (/how.*feel|status|progress/i.test(transcript)) {
    intent = "Providing medical history";
  } else if (/thank|appreciate|grateful/i.test(transcript)) {
    intent = "Expressing gratitude";
  }
  
  return {
    sentiment,
    intent,
    confidence: parseFloat(confidence.toFixed(2)),
  };
}

function generateSOAPNote(transcript: string, patientName: string): SOAPNote {
  const lowerText = transcript.toLowerCase();
  
  let chiefComplaint = "";
  if (/neck.*pain|back.*pain/i.test(transcript)) {
    chiefComplaint = "Neck and back pain";
  } else if (/pain|discomfort|hurt/i.test(transcript)) {
    chiefComplaint = "Pain and discomfort";
  } else {
    chiefComplaint = "Follow-up after injury";
  }
  
  const historyParts: string[] = [];
  if (/accident|collision|crash/i.test(transcript)) {
    historyParts.push("Patient involved in motor vehicle accident");
  }
  if (/\d+\s+(?:weeks|months)/i.test(transcript)) {
    const durationMatch = transcript.match(/(\d+)\s+(weeks|months)/i);
    if (durationMatch) {
      historyParts.push(`experienced symptoms for ${durationMatch[1]} ${durationMatch[2]}`);
    }
  }
  if (/physiotherapy|treatment/i.test(transcript)) {
    historyParts.push("received physiotherapy treatment");
  }
  if (/occasional|better|improving/i.test(lowerText)) {
    historyParts.push("now reporting improvement with occasional symptoms");
  }
  
  const subjective = {
    chief_complaint: chiefComplaint,
    history_of_present_illness: historyParts.join(", ") || "Patient presents for evaluation",
  };
  
  let physicalExam = "";
  if (/full range of motion|full.*movement/i.test(transcript)) {
    physicalExam = "Full range of motion in cervical and lumbar spine, no tenderness detected";
  } else {
    physicalExam = "Physical examination performed, patient assessed for mobility and pain";
  }
  
  let observations = "";
  if (/good condition|normal|no signs/i.test(lowerText)) {
    observations = "Patient appears in normal health, normal gait, no visible distress";
  } else {
    observations = "Patient cooperative and responsive during examination";
  }
  
  const objective = {
    physical_exam: physicalExam,
    observations: observations,
  };
  
  let diagnosis = "";
  if (/whiplash/i.test(transcript)) {
    diagnosis = "Whiplash injury with associated lower back strain";
  } else if (/strain|injury/i.test(transcript)) {
    diagnosis = "Soft tissue injury";
  } else {
    diagnosis = "Post-traumatic musculoskeletal pain";
  }
  
  let severity = "Moderate";
  if (/better|improving|occasional/i.test(lowerText)) {
    severity = "Mild, improving";
  } else if (/severe|intense|constant/i.test(lowerText)) {
    severity = "Moderate to severe";
  }
  
  const assessment = {
    diagnosis: diagnosis,
    severity: severity,
  };
  
  let treatmentPlan = "";
  if (/physiotherapy/i.test(transcript)) {
    treatmentPlan = "Continue physiotherapy as needed, use analgesics for pain relief as required";
  } else {
    treatmentPlan = "Rest, pain management, consider physiotherapy referral";
  }
  
  let followUp = "";
  if (/full recovery|six months/i.test(transcript)) {
    followUp = "Patient to return if pain worsens or persists beyond expected recovery period";
  } else {
    followUp = "Follow-up in 4-6 weeks or sooner if symptoms worsen";
  }
  
  const plan = {
    treatment: treatmentPlan,
    follow_up: followUp,
  };
  
  return {
    subjective,
    objective,
    assessment,
    plan,
  };
}
