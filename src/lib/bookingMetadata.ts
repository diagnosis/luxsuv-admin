import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseKey ? 'present' : 'missing'
  });
  throw new Error(
    'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env file and restart the dev server.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface BookingMetadata {
  booking_id: string;
  viewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const bookingMetadata = {
  async markAsViewed(bookingId: string): Promise<void> {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('booking_metadata')
      .upsert({
        booking_id: bookingId,
        viewed_at: now,
        updated_at: now,
      }, {
        onConflict: 'booking_id'
      });

    if (error) {
      console.error('Failed to mark booking as viewed:', error);
      throw error;
    }
  },

  async getMetadata(bookingIds: string[]): Promise<Map<string, BookingMetadata>> {
    if (bookingIds.length === 0) {
      return new Map();
    }

    const { data, error } = await supabase
      .from('booking_metadata')
      .select('*')
      .in('booking_id', bookingIds);

    if (error) {
      console.error('Failed to fetch booking metadata:', error);
      return new Map();
    }

    const metadataMap = new Map<string, BookingMetadata>();
    data?.forEach((item: BookingMetadata) => {
      metadataMap.set(item.booking_id, item);
    });

    return metadataMap;
  },

  async isViewed(bookingId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('booking_metadata')
      .select('viewed_at')
      .eq('booking_id', bookingId)
      .maybeSingle();

    if (error) {
      console.error('Failed to check if booking is viewed:', error);
      return false;
    }

    return data?.viewed_at != null;
  }
};
