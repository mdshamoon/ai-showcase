import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { prompt, schema } = await request.json();

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Create a new assistant with the provided prompt
    const assistant = await openai.beta.assistants.create({
      name: schema ? "SQL Query Generator" : "Excel File Processor",
      instructions: schema ? `${prompt}\n\nSchema:\n${schema}` : prompt,
      model: "gpt-4-1106-preview",
      tools: [{ type: "code_interpreter" }],
    });

    return NextResponse.json({
      success: true,
      assistant: {
        id: assistant.id,
        name: assistant.name,
        instructions: assistant.instructions,
        model: assistant.model,
        tools: assistant.tools,
      },
    });

  } catch (error) {
    console.error('Error creating assistant:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to create assistant: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating assistant' },
      { status: 500 }
    );
  }
}
