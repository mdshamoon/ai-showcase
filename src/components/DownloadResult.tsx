interface ProcessingResult {
  success: boolean;
  message: string;
  downloadUrl?: string;
  fileName?: string;
}

interface DownloadResultProps {
  result: ProcessingResult;
  onReset: () => void;
}

export function DownloadResult({ result, onReset }: DownloadResultProps) {
  const handleDownload = () => {
    if (result.downloadUrl) {
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.fileName || 'corrected-file.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="text-center py-8">
      <div className="space-y-6">
        <div className={`mx-auto w-16 h-16 ${result.success ? 'text-green-500' : 'text-red-500'}`}>
          {result.success ? (
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className={`text-xl font-semibold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
            {result.success ? '🎉 Processing Complete!' : '❌ Processing Failed'}
          </h3>
          <p className={`${result.success ? 'text-green-700' : 'text-red-700'} max-w-md mx-auto`}>
            {result.message}
          </p>
          {result.success && (
            <p className="text-sm text-gray-600 mt-2">
              Your Excel file has been successfully processed and enhanced by our AI assistant.
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {result.success && result.downloadUrl && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Corrected File
            </button>
          )}
          
          <div>
            <button
              onClick={onReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Process Another File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
