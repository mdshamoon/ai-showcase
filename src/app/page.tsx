'use client';

import { useState } from 'react';
import { AssistantChat } from '@/components/AssistantChat';
import { AssistantDisplay } from '@/components/AssistantDisplay';
import { FileUpload } from '@/components/FileUpload';
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

export default function Home() {
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

  // Show assistant creation screen if no assistant is created yet
  if (!assistant) {
    return (
      <AssistantChat onAssistantCreated={handleAssistantCreated} />
    );
  }

  // Show split interface with assistant details and file upload
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Excel File Processor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI assistant is ready to process Excel files according to your instructions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Assistant Details */}
          <div className="h-full">
            <AssistantDisplay 
              assistantId={assistant.id} 
              prompt={assistant.prompt} 
              onReset={handleResetAssistant}
            />
          </div>

          {/* Right side - File Upload and Processing */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            {!isProcessing && !result && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Excel File</h2>
                <FileUpload onFileUpload={handleFileUpload} assistantId={assistant.id} />
              </div>
            )}

            {isProcessing && (
              <ProcessingStatus />
            )}

            {result && (
              <DownloadResult 
                result={result} 
                onReset={handleReset} 
              />
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Supported formats: .xlsx, .xls</p>
          <p>Maximum file size: 10MB</p>
        </div>
      </div>
    </div>
  );
}
