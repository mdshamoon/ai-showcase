'use client';

import { useState } from 'react';
import { AssistantChat } from '@/components/AssistantChat';
import { AssistantDisplay } from '@/components/AssistantDisplay';
import { ExcelUpload } from '@/components/ExcelUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { DownloadResult } from '@/components/DownloadResult';

interface ProcessingResult {
  success: boolean;
  message: string;
  downloadUrl?: string;
  fileName?: string;
}

interface Assistant {
  id: string;
  prompt: string;
}

export default function AssistantPage() {
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const handleAssistantCreated = (assistantId: string, prompt: string) => {
    setAssistant({ id: assistantId, prompt });
  };

  const handleResetAssistant = () => {
    setAssistant(null);
    setResult(null);
  };

  const handleFileUpload = async (file: File) => {
    if (!assistant) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assistantId', assistant.id);

      const response = await fetch('/api/process-excel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file');
      }

      setResult({
        success: true,
        message: 'File processed successfully!',
        downloadUrl: data.downloadUrl,
        fileName: data.fileName,
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <>
      {/* Assistant Content */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {!assistant ? (
            // Show full screen assistant creation when no assistant exists
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your AI Assistant</h2>
                <p className="text-lg text-gray-600">Create an assistant to process your files</p>
              </div> */}
              <AssistantChat onAssistantCreated={handleAssistantCreated} />
            </div>
          ) : (
            // Show side-by-side layout when assistant exists
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AssistantDisplay 
                assistant={assistant}
                assistantId={assistant?.id || null} 
                prompt={assistant?.prompt || null} 
                onReset={handleResetAssistant}
                handleAssistantCreated={handleAssistantCreated}
                handleFileUpload={handleFileUpload}
              />
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload Excel File</h3>
                <ExcelUpload onFileUpload={handleFileUpload} assistantId={assistant?.id || null} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Status and Results */}
      {isProcessing && (
        <div className="mt-8 flex justify-center">
          <ProcessingStatus />
        </div>
      )}

      {result && (
        <div className="mt-8 flex justify-center">
          <DownloadResult result={result} onReset={handleReset} />
        </div>
      )}
    </>
  );
} 