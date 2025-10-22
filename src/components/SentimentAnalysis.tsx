import { Heart, Target, BarChart3 } from 'lucide-react';

interface SentimentAnalysisProps {
  data: {
    patient_sentiment: string;
    intent: string;
    confidence_score: number;
  } | null;
}

export function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-pink-600" />
          <h2 className="text-xl font-semibold text-gray-800">Sentiment Analysis</h2>
        </div>
        <p className="text-gray-500">No sentiment data available</p>
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'anxious':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'reassured':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'anxious':
        return '😟';
      case 'reassured':
        return '😊';
      default:
        return '😐';
    }
  };

  const confidencePercentage = Math.round(data.confidence_score * 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-6 h-6 text-pink-600" />
        <h2 className="text-xl font-semibold text-gray-800">Sentiment & Intent Analysis</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-medium text-gray-700">Patient Sentiment</h3>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 ${getSentimentColor(
                data.patient_sentiment
              )}`}
            >
              <span className="text-3xl">{getSentimentIcon(data.patient_sentiment)}</span>
              <span className="text-xl font-semibold">{data.patient_sentiment}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-700">Patient Intent</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">{data.intent}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-medium text-gray-700">Confidence Score</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Analysis Confidence</span>
              <span className="text-lg font-bold text-indigo-600">{confidencePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
