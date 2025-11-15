
import React, { useState, useCallback } from 'react';
import { getSecondOpinion } from './services/geminiService';
import { AnalysisResult } from './types';
import ResultCard from './components/ResultCard';
import FileUpload from './components/FileUpload';
import { ToothIcon, AlertTriangleIcon } from './components/icons';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [concern, setConcern] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    setAnalysisResult(null);
    setError(null);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreviewUrl(null);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Please upload a dental scan file.');
      return;
    }
    if (!concern.trim()) {
      setError('Please describe your concern.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await getSecondOpinion(file, concern);
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center md:justify-start">
          <ToothIcon className="w-8 h-8 text-sky-500 mr-3" />
          <h1 className="text-xl md:text-2xl font-bold text-slate-700 tracking-tight">
            Dental Scan Second Opinion
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Get an AI-Powered Second Look</h2>
                <p className="mt-2 text-slate-500">
                    Upload your dental scan and describe your concern to receive an instant analysis.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">1. Upload Your Dental Scan</label>
                <FileUpload onFileSelect={handleFileSelect} selectedFile={file} previewUrl={imagePreviewUrl} />
              </div>
              
              <div>
                <label htmlFor="concern" className="block text-sm font-medium text-slate-700 mb-2">2. Describe Your Concern</label>
                <textarea
                  id="concern"
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  placeholder="e.g., 'I have sensitivity in my upper right tooth when drinking cold water.' or 'What is this dark spot?'"
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !file || !concern}
                  className="w-full flex justify-center items-center bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Scan...
                    </>
                  ) : (
                    'Get Second Opinion'
                  )}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center" role="alert">
                <AlertTriangleIcon className="w-6 h-6 mr-3"/>
                <span className="block sm:inline">{error}</span>
            </div>
          )}

          {analysisResult && (
            <ResultCard result={analysisResult} />
          )}

        </div>
      </main>
      <footer className="text-center py-6 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Dental Second Opinion. All Rights Reserved.</p>
        <p className="mt-1">This service is for informational purposes only and is not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
};

export default App;
