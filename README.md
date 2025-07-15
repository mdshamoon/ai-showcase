# Excel File Processor with OpenAI

A Next.js application that uses OpenAI's Assistants API to process and correct Excel files. Upload your Excel file and receive an AI-corrected version with improved formatting, error fixes, and data standardization.

## Features

- 📊 **Excel File Upload**: Drag and drop or click to select Excel files (.xlsx, .xls)
- 🤖 **AI Processing**: Uses OpenAI's Assistants API for intelligent file correction
- 🔧 **Automatic Corrections**: Fixes spelling errors, standardizes formatting, removes duplicates
- 📥 **Download Results**: Get your corrected Excel file instantly
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- ⚡ **Real-time Status**: Track processing progress with visual feedback

## Prerequisites

- Node.js 18+ 
- OpenAI API key
- OpenAI Assistant ID (created through OpenAI's platform)

## Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd ai_showcase
npm install
```

2. **Configure environment variables:**
Copy `.env.example` to `.env.local` and fill in your values:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=your_assistant_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Set up OpenAI Assistant:**
   - Go to [OpenAI Platform](https://platform.openai.com/assistants)
   - Create a new Assistant
   - Enable Code Interpreter tool
   - Copy the Assistant ID to your `.env.local` file

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

1. **Upload**: Select an Excel file using the drag-and-drop interface
2. **Processing**: The file is uploaded to OpenAI and processed by the Assistant
3. **AI Analysis**: The Assistant analyzes the file and applies corrections:
   - Fixes spelling errors
   - Standardizes formatting
   - Removes duplicate rows
   - Ensures data consistency
   - Corrects formulas
   - Improves capitalization and spacing
4. **Download**: Receive the corrected Excel file

## API Endpoints

### POST `/api/process-excel`
Processes an uploaded Excel file through OpenAI's Assistant.

**Request:** Form data with `file` field
**Response:** JSON with download URL and metadata

## File Limits

- **Supported formats**: .xlsx, .xls
- **Maximum file size**: 10MB
- **Processing timeout**: 5 minutes

## Project Structure

```
src/
├── app/
│   ├── api/process-excel/     # API endpoint for file processing
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page component
├── components/
│   ├── FileUpload.tsx         # File upload component
│   ├── ProcessingStatus.tsx   # Processing indicator
│   └── DownloadResult.tsx     # Results and download component
```

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **File Handling**: react-dropzone, xlsx
- **AI Integration**: OpenAI SDK (Assistants API v2)
- **Deployment**: Vercel-ready

## Customization

The AI correction prompt is hardcoded in `/src/app/api/process-excel/route.ts`. You can modify the `CORRECTION_PROMPT` variable to customize what corrections the AI makes to your files.

## Error Handling

The application includes comprehensive error handling for:
- Invalid file types
- File size limits
- API failures
- Processing timeouts
- Network issues

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Remember to add your environment variables in the Vercel dashboard.

## License

MIT License - see LICENSE file for details.
