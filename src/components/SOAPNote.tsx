import { ClipboardList, User, Eye, Stethoscope, Calendar } from 'lucide-react';

interface SOAPNoteProps {
  data: {
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
  } | null;
}

export function SOAPNote({ data }: SOAPNoteProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-semibold text-gray-800">SOAP Note</h2>
        </div>
        <p className="text-gray-500">No SOAP note available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="w-6 h-6 text-teal-600" />
        <h2 className="text-xl font-semibold text-gray-800">SOAP Note</h2>
      </div>

      <div className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Subjective</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Chief Complaint</p>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-md">
                {data.subjective.chief_complaint}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                History of Present Illness
              </p>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-md">
                {data.subjective.history_of_present_illness}
              </p>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Objective</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Physical Examination</p>
              <p className="text-gray-700 bg-green-50 p-3 rounded-md">
                {data.objective.physical_exam}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Observations</p>
              <p className="text-gray-700 bg-green-50 p-3 rounded-md">
                {data.objective.observations}
              </p>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-amber-500 pl-4">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-800">Assessment</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Diagnosis</p>
              <p className="text-gray-700 bg-amber-50 p-3 rounded-md">
                {data.assessment.diagnosis}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Severity</p>
              <p className="text-gray-700 bg-amber-50 p-3 rounded-md">
                {data.assessment.severity}
              </p>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Plan</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Treatment</p>
              <p className="text-gray-700 bg-purple-50 p-3 rounded-md">{data.plan.treatment}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Follow-up</p>
              <p className="text-gray-700 bg-purple-50 p-3 rounded-md">{data.plan.follow_up}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
