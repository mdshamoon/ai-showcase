'use client';

interface Assistant {
  id: string;
  prompt: string;
  schema: string;
}

interface SqlDisplayProps {
  assistant: Assistant | null;
  onReset: () => void;
}

export function SqlDisplay({ assistant, onReset }: SqlDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 h-full">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Your Database Configuration</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Configure New Database
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Assistant ID
          </label>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 break-all border border-gray-200">
            {assistant?.id}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instructions
          </label>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 border border-gray-200">
            <pre className="whitespace-pre-wrap font-sans">{assistant?.prompt}</pre>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Database Schema
          </label>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 max-h-96 overflow-y-auto border border-gray-200">
            <pre className="whitespace-pre-wrap font-mono">{assistant?.schema}</pre>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Assistant Ready</h3>
              <p className="text-sm text-green-700 mt-1">
                Your SQL assistant has been created and is ready to generate queries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
