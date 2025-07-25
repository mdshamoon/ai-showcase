'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  showHeader?: boolean;
}

export function ExcelUpload({ onFileUpload, showHeader = true }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <div className="w-full min-w-[400px] min-h-[600px]">
      {showHeader && (
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Clean Your Data</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Upload your Excel file and let our AI assistant analyze, correct, and enhance your data automatically
            </p>
            <div className="flex justify-center space-x-8 text-base text-gray-500 mb-8">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Data Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Error Correction</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Data Enhancement</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all duration-200 hover:shadow-lg min-h-[400px] flex items-center justify-center
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50 shadow-lg' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-6 w-full">
          <div className="mx-auto w-20 h-20 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-colors duration-200 ${isDragActive ? 'text-blue-500' : ''}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          {isDragActive ? (
            <div>
              <p className="text-2xl text-blue-600 font-semibold mb-3">
                Drop your Excel file here...
              </p>
              <p className="text-base text-blue-500">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl text-gray-700 font-semibold mb-4">
                Drag and drop your Excel file here
              </p>
              <p className="text-lg text-gray-500 mb-6">
                or click to browse and select a file
              </p>
              <p className="text-base text-gray-400">
                Supports .xlsx and .xls files up to 10MB
              </p>
            </div>
          )}
          
          <button
            type="button"
            className="inline-flex items-center px-10 py-4 border border-transparent text-xl font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg mt-8"
          >
            Select File
          </button>
        </div>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-base font-semibold text-green-800">
                Selected file: <span className="font-bold">{acceptedFiles[0].name}</span>
              </p>
              <p className="text-sm text-green-600 mt-1">
                Size: {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}