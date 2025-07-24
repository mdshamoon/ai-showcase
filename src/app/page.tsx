'use client';

import { useState, useEffect } from 'react';
import { ExcelUpload } from '@/components/ExcelUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { DownloadResult } from '@/components/DownloadResult';

interface ProcessingResult {
  success: boolean;
  message: string;
  downloadUrl?: string;
  fileName?: string;
}

export default function Home() {
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  // Get assistant ID from environment variables on component mount
  useEffect(() => {
    const envAssistantId = process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID;
    if (envAssistantId) {
      setAssistantId(envAssistantId);
    } else {
      console.error('NEXT_PUBLIC_OPENAI_ASSISTANT_ID not found in environment variables');
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!assistantId) {
      setResult({
        success: false,
        message: 'Assistant ID not configured. Please check your environment variables.',
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assistantId', assistantId);

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
        message: 'File processed successfully! Your Excel file has been analyzed and corrected.',
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

  // Show loading state while getting assistant ID
  if (!assistantId) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Initializing AI Assistant...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Excel Upload Content */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {!isProcessing && !result && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <ExcelUpload onFileUpload={handleFileUpload} />
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <ProcessingStatus />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <DownloadResult result={result} onReset={handleReset} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
