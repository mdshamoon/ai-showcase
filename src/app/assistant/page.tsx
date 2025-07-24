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
        message: 'File processed successfully! Your Excel file has been analyzed and enhanced by your custom assistant.',
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
      <div className="flex justify-center px-4">
        <div className="w-full max-w-7xl">
          {!assistant ? (
            // Show full screen assistant creation when no assistant exists
            <div className="bg-white rounded-xl shadow-lg p-8 min-w-[800px] min-h-[600px]">
              <AssistantChat onAssistantCreated={handleAssistantCreated} />
            </div>
          ) : (
            // Show side-by-side layout when assistant exists - wider layout with equal heights
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 min-h-[700px]">
              <div className="flex">
                <AssistantDisplay 
                  assistant={assistant}
                  assistantId={assistant?.id || null} 
                  prompt={assistant?.prompt || null} 
                  onReset={handleResetAssistant}
                  handleAssistantCreated={handleAssistantCreated}
                  handleFileUpload={handleFileUpload}
                />
              </div>
              <div className="flex flex-col space-y-8">
                {!isProcessing && !result && (
                  <div className="bg-white rounded-xl shadow-lg p-8 flex-1 min-w-[400px] min-h-[600px]">
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upload Excel File</h3>
                      <p className="text-gray-600">Upload your Excel file to process it with your custom assistant</p>
                    </div>
                    <ExcelUpload onFileUpload={handleFileUpload} showHeader={false} />
                  </div>
                )}

                {/* Processing Status */}
                {isProcessing && (
                  <div className="bg-white rounded-xl shadow-lg p-8 flex-1 min-w-[400px] min-h-[500px]">
                    <ProcessingStatus />
                  </div>
                )}

                {/* Results */}
                {result && (
                  <div className="bg-white rounded-xl shadow-lg p-8 flex-1 min-w-[400px] min-h-[500px]">
                    <DownloadResult result={result} onReset={handleReset} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Status and Results - now handled inline above */}
    </>
  );
} 