import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { FiX, FiDownload } from 'react-icons/fi';

interface EmailModalProps {
  filename: string;
  onClose: () => void;
}

export function EmailModal({ filename, onClose }: EmailModalProps) {
  const { data: emailContent, isLoading, error } = useQuery({
    queryKey: ['email-content', filename],
    queryFn: () => api.getEmailContent(filename),
  });

  const handleDownload = () => {
    if (emailContent) {
      const blob = new Blob([emailContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Email Content</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              disabled={!emailContent}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              <FiDownload className="h-4 w-4 mr-1" />
              Download
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 h-64 flex items-center justify-center">
              Error loading email content
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="text-sm font-medium text-gray-700 mb-2">File Information</h3>
                <p className="text-xs text-gray-600 font-mono">{filename}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Email Content</h3>
                <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-x-auto">
                  {emailContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}