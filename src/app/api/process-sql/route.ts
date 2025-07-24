import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the function schema for SQL query generation
const generateSqlFunction = {
  name: 'generate_sql_query',
  description: 'Generate a SQL query based on the provided schema and natural language request',
  parameters: {
    type: 'object',
    properties: {
      sqlQuery: {
        type: 'string',
        description: 'The generated SQL query that fulfills the user\'s request'
      },
      explanation: {
        type: 'string',
        description: 'A brief explanation of what the SQL query does'
      }
    },
    required: ['sqlQuery', 'explanation']
  }
} as const;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { query, schema } = body;

    if (!query || !schema) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Create the system message with the schema
    const systemMessage = `You are an expert SQL query generator. Use the following database schema to generate SQL queries:

${schema}

Generate SQL queries that are efficient, accurate, and follow best practices. Always include proper JOINs when needed and consider edge cases.`;

    // Call the OpenAI API with function calling
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: query }
      ],
      functions: [generateSqlFunction],
      function_call: { name: 'generate_sql_query' }
    });

    // Get the function call response
    const functionCall = response.choices[0]?.message?.function_call;
    
    if (!functionCall || !functionCall.arguments) {
      throw new Error('Failed to generate SQL query');
    }

    // Parse the function arguments
    const { sqlQuery, explanation } = JSON.parse(functionCall.arguments);

    return NextResponse.json({ 
      query: sqlQuery,
      explanation: explanation 
    });
  } catch (error) {
    console.error('Error processing SQL query:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
