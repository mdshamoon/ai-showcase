'use client';

interface AssistantDisplayProps {
  assistant: any | null;
  assistantId: string | null;
  prompt: string | null;
  onReset: () => void;
  handleAssistantCreated: (assistantId: string, prompt: string) => void;
  handleFileUpload: (file: File) => void;
}

export function AssistantDisplay({ assistant, assistantId, prompt, onReset, handleAssistantCreated, handleFileUpload }: AssistantDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 h-full">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your AI Assistant</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Create New Assistant
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Assistant ID
          </label>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 break-all border border-gray-200">
            {assistantId}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instructions
          </label>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 max-h-96 overflow-y-auto border border-gray-200">
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
