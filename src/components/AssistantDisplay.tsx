'use client';

interface AssistantDisplayProps {
  assistantId: string;
  prompt: string;
  onReset: () => void;
}

export function AssistantDisplay({ assistantId, prompt, onReset }: AssistantDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Your AI Assistant</h2>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Create New Assistant
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assistant ID
          </label>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-800 break-all">
            {assistantId}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions
          </label>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans">{prompt}</pre>
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
                Your assistant has been created and is ready to process Excel files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
