export function ProcessingStatus() {
  return (
    <div className="text-center py-12">
      <div className="space-y-6">
        <div className="mx-auto w-16 h-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Processing your Excel file...
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Our AI assistant is analyzing and processing your Excel file. This may take a few moments.
          </p>
        </div>
        
        <div className="space-y-3 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span>Uploading file to OpenAI...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <span>Creating thread and running assistant...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <span>Analyzing and correcting data...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <span>Generating corrected file...</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            💡 <strong>Tip:</strong> Large files may take longer to process. Please be patient while our AI analyzes your data.
          </p>
        </div>
      </div>
    </div>
  );
}
