import { useState } from 'react';
import { FileText, Send, Loader2, Download } from 'lucide-react';
import { MedicalAnalysis } from './components/MedicalAnalysis';
import { SentimentAnalysis } from './components/SentimentAnalysis';
import { SOAPNote } from './components/SOAPNote';
import { processTranscript } from './services/nlpService';

const SAMPLE_TRANSCRIPT = `Physician: Good morning, Ms. Jones. How are you feeling today?

Patient: Good morning, doctor. I'm doing better, but I still have some discomfort now and then.

Physician: I understand you were in a car accident last September. Can you walk me through what happened?

Patient: Yes, it was on September 1st, around 12:30 in the afternoon. I was driving from Cheadle Hulme to Manchester when I had to stop in traffic. Out of nowhere, another car hit me from behind, which pushed my car into the one in front.

Physician: That sounds like a strong impact. Were you wearing your seatbelt?

Patient: Yes, I always do.

Physician: What did you feel immediately after the accident?

Patient: At first, I was just shocked. But then I realized I had hit my head on the steering wheel, and I could feel pain in my neck and back almost right away.

Physician: Did you seek medical attention at that time?

Patient: Yes, I went to Moss Bank Accident and Emergency. They checked me over and said it was a whiplash injury, but they didn't do any X-rays. They just gave me some advice and sent me home.

Physician: How did things progress after that?

Patient: The first four weeks were rough. My neck and back pain were really bad—I had trouble sleeping and had to take painkillers regularly. It started improving after that, but I had to go through ten sessions of physiotherapy to help with the stiffness and discomfort.

Physician: That makes sense. Are you still experiencing pain now?

Patient: It's not constant, but I do get occasional backaches. It's nothing like before, though.

Physician: That's good to hear. Have you noticed any other effects, like anxiety while driving or difficulty concentrating?

Patient: No, nothing like that. I don't feel nervous driving, and I haven't had any emotional issues from the accident.

Physician: And how has this impacted your daily life? Work, hobbies, anything like that?

Patient: I had to take a week off work, but after that, I was back to my usual routine. It hasn't really stopped me from doing anything.

Physician: That's encouraging. Let's go ahead and do a physical examination to check your mobility and any lingering pain.

[Physical Examination Conducted]

Physician: Everything looks good. Your neck and back have a full range of movement, and there's no tenderness or signs of lasting damage. Your muscles and spine seem to be in good condition.

Patient: That's a relief!

Physician: Yes, your recovery so far has been quite positive. Given your progress, I'd expect you to make a full recovery within six months of the accident. There are no signs of long-term damage or degeneration.

Patient: That's great to hear. So, I don't need to worry about this affecting me in the future?

Physician: That's right. I don't foresee any long-term impact on your work or daily life. If anything changes or you experience worsening symptoms, you can always come back for a follow-up. But at this point, you're on track for a full recovery.

Patient: Thank you, doctor. I appreciate it.

Physician: You're very welcome, Ms. Jones. Take care, and don't hesitate to reach out if you need anything.`;

function App() {
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPT);
  const [patientName, setPatientName] = useState('Janet Jones');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!transcript.trim() || !patientName.trim()) {
      setError('Please provide both patient name and transcript');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const result = await processTranscript(transcript, patientName);
      setResults(result);
    } catch (err: any) {
      setError(err.message || 'Failed to process transcript');
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    if (!results) return;

    const exportData = {
      patient_name: patientName,
      transcript: transcript,
      medical_analysis: results.medicalAnalysis,
      sentiment_analysis: results.sentimentAnalysis,
      soap_note: results.soapNote,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-analysis-${patientName.replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="w-12 h-12 text-teal-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Physician Notetaker AI
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced NLP system for medical transcription, analysis, sentiment detection, and
              automated SOAP note generation
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Transcript
                </label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[300px] font-mono text-sm"
                  placeholder="Paste physician-patient conversation transcript here..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleProcess}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Process Transcript
                    </>
                  )}
                </button>

                {results && (
                  <button
                    onClick={exportToJSON}
                    className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export JSON
                  </button>
                )}
              </div>
            </div>
          </div>

          {results && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MedicalAnalysis data={results.medicalAnalysis} />
                <SentimentAnalysis data={results.sentimentAnalysis} />
              </div>

              <SOAPNote data={results.soapNote} />
            </div>
          )}

          {!results && !loading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Ready to Process
              </h3>
              <p className="text-gray-500">
                Enter a patient name and transcript above, then click "Process Transcript" to
                generate medical analysis, sentiment detection, and SOAP notes.
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            Medical NLP System • Named Entity Recognition • Sentiment Analysis • SOAP Note
            Generation
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
