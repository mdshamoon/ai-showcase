'use client';

interface Assistant {
  id: string;
  prompt: string;
}

interface AssistantDisplayProps {
  assistant: Assistant | null;
  assistantId: string | null;
  prompt: string | null;
  onReset: () => void;
  handleAssistantCreated: (assistantId: string, prompt: string) => void;
  handleFileUpload: (file: File) => void;
}

export function AssistantDisplay({ assistantId, prompt, onReset }: AssistantDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full h-full flex flex-col min-w-[400px] min-h-[600px]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Your AI Assistant</h2>
          <p className="text-gray-600">Custom assistant ready to process your Excel files</p>
        </div>
        <button
          onClick={onReset}
          className="px-6 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
        >
          Create New Assistant
        </button>
      </div>

      <div className="space-y-8 flex-1">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Assistant ID
          </label>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 break-all border border-gray-200">
            {assistantId}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Assistant Instructions
          </label>
          <div className="bg-gray-50 rounded-lg p-6 text-sm text-gray-800 h-48 overflow-y-auto border border-gray-200">
            <pre className="whitespace-pre-wrap font-sans leading-relaxed">{prompt}</pre>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-base font-semibold text-green-800 mb-1">Assistant Ready</h3>
              <p className="text-sm text-green-700">
                Your custom assistant has been created and is ready to process Excel files according to your specific instructions.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-base font-semibold text-blue-800 mb-1">How it works</h3>
              <p className="text-sm text-blue-700">
                Upload your Excel file on the right, and this assistant will process it according to the instructions you provided during creation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
