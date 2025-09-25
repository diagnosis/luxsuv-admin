import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Layout } from '../layout/Layout';
import { EmailsList } from './EmailsList';

export function EmailsPage() {
  const { data: emails, isLoading, error } = useQuery({
    queryKey: ['emails'],
    queryFn: () => api.getEmails(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Notifications</h1>
          <p className="text-gray-600 mt-2">
            Monitor all email notifications sent by the system
          </p>
        </div>

        <EmailsList 
          emails={emails || []} 
          isLoading={isLoading} 
          error={error} 
        />
      </div>
    </Layout>
  );
}