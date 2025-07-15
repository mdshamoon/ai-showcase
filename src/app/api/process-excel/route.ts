import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as XLSX from 'xlsx';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

// Hardcoded prompt for Excel correction
const CORRECTION_PROMPT = `
Please analyze the uploaded Excel file.
`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_ASSISTANT_ID) {
      return NextResponse.json(
        { error: 'OpenAI API key or Assistant ID not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer for OpenAI upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a File object for OpenAI
    const openaiFile = new File([buffer], file.name, {
      type: file.type,
    });

    console.log('Uploading file to OpenAI...');
    // Upload file to OpenAI
    const uploadedFile = await openai.files.create({
      file: openaiFile,
      purpose: 'assistants',
    });

    console.log('Creating thread...');
    // Create a thread
    const thread = await openai.beta.threads.create();

    console.log('Adding message to thread...');
    // Add message with file to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: CORRECTION_PROMPT,
      attachments: [
        {
          file_id: uploadedFile.id,
          tools: [{ type: 'code_interpreter' }],
        },
      ],
    });

    console.log('Running assistant...');
    // Run the assistant  
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID!,
    });
    
    console.log('Created run with ID:', run.id);
    console.log('Full run object:', JSON.stringify(run, null, 2));

    // Check if run.id exists
    if (!run.id) {
      console.error('Run ID is undefined!', run);
      return NextResponse.json(
        { error: 'Failed to create run - no ID returned' },
        { status: 500 }
      );
    }

    // Poll for completion
    let runStatus = run;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes timeout (5 second intervals)

    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      if (attempts >= maxAttempts) {
        console.error('Processing timeout reached after', attempts, 'attempts');
        console.log('Final run status:', JSON.stringify(runStatus, null, 2));
        return NextResponse.json(
          { error: 'Processing timeout. Please try again.' },
          { status: 408 }
        );
      }

      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      console.log('Retrieving run status for run ID:', run.id, 'in thread:', thread.id);
      console.log('Thread ID type:', typeof thread.id, 'Run ID type:', typeof run.id);
      
      // Validate IDs before making the call
      if (!thread.id || !run.id) {
        console.error('Missing IDs - thread.id:', thread.id, 'run.id:', run.id);
        return NextResponse.json(
          { error: 'Invalid thread or run ID' },
          { status: 500 }
        );
      }
      
      try {
        // Fix: Use the outer runStatus variable, don't declare a new one
        runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
        console.log(`Retrieved run status: ${runStatus.status}, last_error: ${runStatus.last_error?.message || 'none'}`);
        console.log('Full run status:', JSON.stringify(runStatus, null, 2));
      } catch (retrieveError) {
        console.error('Error retrieving run status:', retrieveError);
        // Don't return immediately, just log the error and continue
        console.log('Continuing with previous status...');
      }
      attempts++;
      console.log(`Run status: ${runStatus.status} (attempt ${attempts})`);
      
      // Check for specific error conditions
      if (runStatus.status === 'requires_action') {
        console.error('Run requires action - this might indicate an issue with the assistant configuration');
        console.log('Required action:', runStatus.required_action);
        return NextResponse.json(
          { error: 'Assistant requires action - please check your assistant configuration' },
          { status: 500 }
        );
      }
    }

    if (runStatus.status === 'failed') {
      console.error('Run failed:', runStatus.last_error);
      return NextResponse.json(
        { error: 'Assistant processing failed. Please try again.' },
        { status: 500 }
      );
    }

    if (runStatus.status !== 'completed') {
      console.error('Unexpected run status:', runStatus.status);
      return NextResponse.json(
        { error: `Processing ended with status: ${runStatus.status}` },
        { status: 500 }
      );
    }

    console.log('Retrieving messages...');
    // Get the messages from the thread
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(
      (message) => message.role === 'assistant'
    );

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from assistant' },
        { status: 500 }
      );
    }

    // Look for file attachments in the assistant's response
    let correctedFileId: string | null = null;
    let correctedFileName = `corrected_${file.name}`;

    for (const content of assistantMessage.content) {
      if (content.type === 'text' && content.text.annotations) {
        for (const annotation of content.text.annotations) {
          if (annotation.type === 'file_path' && annotation.file_path) {
            correctedFileId = annotation.file_path.file_id;
            break;
          }
        }
      }
    }

    if (!correctedFileId) {
      // If no file was generated, return the original message
      const textContent = assistantMessage.content.find(c => c.type === 'text');
      return NextResponse.json(
        { 
          error: 'No corrected file was generated. Assistant response: ' + 
                 (textContent?.type === 'text' ? textContent.text.value : 'No text response')
        },
        { status: 500 }
      );
    }

    console.log('Downloading corrected file...');
    // Download the corrected file from OpenAI
    const correctedFile = await openai.files.content(correctedFileId);
    const correctedFileBuffer = await correctedFile.arrayBuffer();

    // Create a data URL for download
    const base64Data = Buffer.from(correctedFileBuffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    // Clean up: delete the uploaded file from OpenAI
    try {
      await openai.files.delete(uploadedFile.id);
      if (correctedFileId !== uploadedFile.id) {
        await openai.files.delete(correctedFileId);
      }
    } catch (cleanupError) {
      console.warn('Failed to clean up OpenAI files:', cleanupError);
    }

    return NextResponse.json({
      success: true,
      message: 'File processed successfully',
      downloadUrl: dataUrl,
      fileName: correctedFileName,
    });

  } catch (error) {
    console.error('Error processing file:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Processing failed: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred during processing' },
      { status: 500 }
    );
  }
}
