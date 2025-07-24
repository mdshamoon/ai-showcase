'use client';

import { useState } from 'react';

interface Assistant {
  id: string;
  prompt: string;
  schema: string;
}

interface SqlChatProps {
  onAssistantCreated: (assistantId: string, prompt: string, schema: string) => void;
  existingAssistant?: Assistant | null;
  onQuerySubmit?: (query: string) => void;
  sqlResult?: { query: string; explanation: string } | null;
  isProcessing?: boolean;
}

export function SqlChat({ 
  onAssistantCreated, 
  existingAssistant,
  onQuerySubmit,
  sqlResult,
  isProcessing
}: SqlChatProps) {
  const [prompt] = useState('You are an expert at generating SQL queries from the schema that we provide you.');
  const [schema, setSchema] = useState('');
  const [query, setQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schema.trim() && !existingAssistant) {
      setError('Please enter your database schema');
      return;
    }

    if (existingAssistant && onQuerySubmit) {
      if (!query.trim()) {
        setError('Please enter your question');
        return;
      }
      onQuerySubmit(query);
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/create-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          schema: schema.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create assistant');
      }

      onAssistantCreated(data.assistant.id, prompt.trim(), schema.trim());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  if (existingAssistant) {
    return (
      <div className="space-y-6">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Your Question
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Example: Get all users who have made a purchase in the last month..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            disabled={isProcessing}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !query.trim()}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
              isProcessing || !query.trim()
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'Generating Query...' : 'Generate SQL Query'}
          </button>
        </div>

        {sqlResult && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Explanation:</h3>
              <p className="text-gray-700">{sqlResult.explanation}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generated SQL Query:</h3>
              <div className="bg-gray-900 text-white p-4 rounded-lg font-mono">
                <pre className="whitespace-pre-wrap">{sqlResult.query}</pre>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(sqlResult.query)}
                className="mt-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Generate SQL from Text
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your plain English questions into SQL queries. Just paste your database schema below to get started.
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="schema" className="block text-base font-medium text-gray-700 mb-2">
                Database Schema
              </label>
              <textarea
                id="schema"
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                placeholder="Paste your database schema here..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[200px]"
                disabled={isCreating}
              />
              <p className="mt-2 text-sm text-gray-500">
                Paste your database schema including table definitions and relationships.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isCreating || !schema.trim()}
                className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
                  isCreating || !schema.trim()
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isCreating ? 'Creating Assistant...' : 'Create Assistant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
