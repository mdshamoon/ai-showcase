'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { DownloadResult } from '@/components/DownloadResult';

interface ProcessingResult {
  success: boolean;
  message: string;
  downloadUrl?: string;
  fileName?: string;
}

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Excel File Processor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your Excel file and let our AI assistant correct and improve it based on intelligent analysis.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {!isProcessing && !result && (
            <FileUpload onFileUpload={handleFileUpload} />
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

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Supported formats: .xlsx, .xls</p>
          <p>Maximum file size: 10MB</p>
        </div>
      </div>
    </div>
  );
}
