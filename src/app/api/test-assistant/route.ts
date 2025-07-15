import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_ASSISTANT_ID) {
      return NextResponse.json(
        { error: 'OpenAI API key or Assistant ID not configured' },
        { status: 500 }
      );
    }

    console.log('Testing assistant with ID:', ASSISTANT_ID);

    // Test 1: Retrieve assistant information
    const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID!);
    console.log('Assistant retrieved:', assistant.name, assistant.model);
    console.log('Assistant tools:', assistant.tools);

    // Test 2: Create a simple thread and run
    const thread = await openai.beta.threads.create();
    console.log('Thread created:', thread.id);

    // Test 3: Add a simple message
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: 'Hello, can you help me process Excel files?',
    });

    // Test 4: Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID!,
    });

    console.log('Run created:', run.id, 'with status:', run.status);

    // Test 5: Wait for completion (max 30 seconds)
    let runStatus = run;
    let attempts = 0;
    const maxAttempts = 6; // 30 seconds

    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      if (attempts >= maxAttempts) {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
      attempts++;
      console.log(`Test run status: ${runStatus.status} (attempt ${attempts})`);
    }

    return NextResponse.json({
      success: true,
      assistant: {
        id: assistant.id,
        name: assistant.name,
        model: assistant.model,
        tools: assistant.tools,
      },
      test_run: {
        id: run.id,
        final_status: runStatus.status,
        attempts: attempts,
        last_error: runStatus.last_error,
      },
    });

  } catch (error) {
    console.error('Error testing assistant:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Test failed: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred during testing' },
      { status: 500 }
    );
  }
}
