'use client';

import { useState } from 'react';
import { SqlUpload } from '@/components/SqlUpload';
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

export default function SqlPage() {
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!assistant) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assistantId', assistant.id);

      const response = await fetch('/api/process-sql', {
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
      {/* SQL Upload Content */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <SqlUpload onFileUpload={handleFileUpload} assistantId={assistant?.id || null} />
          </div>
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