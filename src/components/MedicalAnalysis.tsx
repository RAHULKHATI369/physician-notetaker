import { FileText, AlertCircle, Pill, Activity, TrendingUp, Tag } from 'lucide-react';

interface MedicalAnalysisProps {
  data: {
    symptoms: string[];
    diagnosis: string;
    treatment: string[];
    current_status: string;
    prognosis: string;
    keywords: string[];
  } | null;
}

export function MedicalAnalysis({ data }: MedicalAnalysisProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Medical Analysis</h2>
        </div>
        <p className="text-gray-500">No analysis data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Medical Analysis</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-medium text-gray-700">Symptoms</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.symptoms.map((symptom, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>

        {data.diagnosis && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-700">Diagnosis</h3>
            </div>
            <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">{data.diagnosis}</p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-medium text-gray-700">Treatment</h3>
          </div>
          <ul className="space-y-2">
            {data.treatment.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {data.current_status && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-medium text-gray-700">Current Status</h3>
            </div>
            <p className="text-gray-600 bg-amber-50 p-3 rounded-lg">{data.current_status}</p>
          </div>
        )}

        {data.prognosis && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-medium text-gray-700">Prognosis</h3>
            </div>
            <p className="text-gray-600 bg-emerald-50 p-3 rounded-lg">{data.prognosis}</p>
          </div>
        )}

        {data.keywords.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-slate-500" />
              <h3 className="text-lg font-medium text-gray-700">Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
