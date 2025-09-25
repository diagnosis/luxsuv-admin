import { useState } from 'react';
import { FiMail, FiClock, FiEye, FiRefreshCw } from 'react-icons/fi';
import { EmailModal } from './EmailModal';

interface EmailsListProps {
  emails: string[];
  isLoading: boolean;
  error: any;
}

export function EmailsList({ emails, isLoading, error }: EmailsListProps) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const parseEmailFilename = (filename: string) => {
    // Format: 20250115_103045_booking_access.eml
    const parts = filename.replace('.eml', '').split('_');
    if (parts.length >= 3) {
      const date = parts[0];
      const time = parts[1];
      const type = parts.slice(2).join('_');
      
      const year = date.slice(0, 4);
      const month = date.slice(4, 6);
      const day = date.slice(6, 8);
      const hour = time.slice(0, 2);
      const minute = time.slice(2, 4);
      
      const dateObj = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
      
      return {
        datetime: dateObj,
        type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        filename
      };
    }
    
    return {
      datetime: new Date(),
      type: 'Unknown',
      filename
    };
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <FiRefreshCw className="h-6 w-6 animate-spin text-purple-600 mr-2" />
          <span className="text-gray-600">Loading emails...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">
          Error loading emails: {error.message}
        </div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <FiMail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
          <p className="text-gray-500">Email notifications will appear here when sent.</p>
        </div>
      </div>
    );
  }

  const parsedEmails = emails.map(parseEmailFilename).sort((a, b) => b.datetime.getTime() - a.datetime.getTime());

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Email Notifications</h2>
            <span className="text-sm text-gray-500">
              {emails.length} email{emails.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {parsedEmails.map((email) => (
            <div key={email.filename} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiMail className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{email.type}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <FiClock className="h-3 w-3 mr-1" />
                      {formatDateTime(email.datetime)}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-mono">{email.filename}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmail(email.filename)}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
                >
                  <FiEye className="h-3 w-3 mr-1" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEmail && (
        <EmailModal
          filename={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </>
  );
}