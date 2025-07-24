'use client';

import { useState } from 'react';
import { SqlChat } from '@/components/SqlChat';
import { SqlDisplay } from '@/components/SqlDisplay';

interface Assistant {
  id: string;
  prompt: string;
  schema: string;
}

interface SqlResult {
  query: string;
  explanation: string;
}

export default function SqlPage() {
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sqlResult, setSqlResult] = useState<SqlResult | null>(null);

  const handleAssistantCreated = (assistantId: string, prompt: string, schema: string) => {
    setAssistant({ id: assistantId, prompt, schema });
  };

  const handleResetAssistant = () => {
    setAssistant(null);
    setSqlResult(null);
  };

  const handleQuerySubmission = async (query: string) => {
    if (!assistant) return;

    setIsProcessing(true);
    setSqlResult(null);

    try {
      const response = await fetch('/api/process-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantId: assistant.id,
          query,
          schema: assistant.schema
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process query');
      }

      setSqlResult({
        query: data.query,
        explanation: data.explanation
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* SQL Assistant Content */}
      <div className="flex justify-center px-4">
        <div className="w-full max-w-5xl">
          {!assistant ? (
            <div className="bg-white rounded-xl shadow-lg p-8 min-w-[800px] min-h-[600px]">
              <SqlChat onAssistantCreated={handleAssistantCreated} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[700px]">
              <SqlDisplay 
                assistant={assistant}
                onReset={handleResetAssistant}
              />
              <div className="bg-white rounded-xl shadow-lg p-8 min-w-[400px] min-h-[600px]">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Ask Your Question</h2>
                <SqlChat 
                  onAssistantCreated={handleAssistantCreated}
                  existingAssistant={assistant}
                  onQuerySubmit={handleQuerySubmission}
                  sqlResult={sqlResult}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}