'use client';

import { useState } from 'react';
import { AssistantChat } from '@/components/AssistantChat';
import { AssistantDisplay } from '@/components/AssistantDisplay';
import { ExcelUpload } from '@/components/ExcelUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { DownloadResult } from '@/components/DownloadResult';
import { SqlUpload } from '@/components/SqlUpload';

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

  const [activeTab, setActiveTab] = useState<string>('excel'); 
  const tabs = ['excel','assistant','sql'];

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

  // Show split interface with assistant details and file upload
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Beautiful Tabs */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Showcase</h1>
          
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl shadow-lg p-2 inline-flex">
              {tabs.map((tab, index) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } ${index === 0 ? 'rounded-l-lg' : ''} ${index === tabs.length - 1 ? 'rounded-r-lg' : ''}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {activeTab === 'excel' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <ExcelUpload onFileUpload={handleFileUpload} assistantId={assistant?.id || null} />
              </div>
            )}

            {activeTab === 'assistant' && (
              <div>
                {!assistant ? (
                  // Show full screen assistant creation when no assistant exists
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your AI Assistant</h2>
                      <p className="text-lg text-gray-600">Create an assistant to process your files</p>
                    </div>
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
            )}

            {activeTab === 'sql' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <SqlUpload onFileUpload={handleFileUpload} assistantId={assistant?.id || null} />
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
      </div>
    </div>
  );
}
