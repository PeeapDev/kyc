import { supabase } from '../supabase'

export interface QueueItem {
  id: string;
  phone_number: string;
  queue_number: string;
  status: string;
  joined_at: string;
}

export class QueueService {
  async addToQueue(phoneNumber: string, queueNumber: string): Promise<string> {
    try {
      console.log('Adding to queue:', { phoneNumber, queueNumber });

      const { data, error } = await supabase
        .from('queue_items')
        .insert([{
          phone_number: phoneNumber,
          queue_number: queueNumber,
          status: 'waiting',
          joined_at: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Error adding to queue:', error);
        throw error;
      }

      console.log('Successfully added to queue:', data);
      return data.id;
    } catch (error) {
      console.error('Error in addToQueue:', error);
      throw error;
    }
  }

  async getQueue(): Promise<QueueItem[]> {
    try {
      const { data, error } = await supabase
        .from('queue_items')
        .select('*')
        .order('joined_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting queue:', error);
      return [];
    }
  }

  async getLastQueueNumber(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('queue_items')
        .select('queue_number')
        .order('joined_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return 0; // No records found
        throw error;
      }

      return parseInt(data.queue_number);
    } catch (error) {
      console.error('Error getting last queue number:', error);
      return 0;
    }
  }

  async resetQueue() {
    const { error } = await supabase
      .from('queue_items')
      .delete()
      .neq('status', 'completed') // Optionally keep completed items
    if (error) {
      console.error('Error resetting queue:', error)
      throw error
    }
  }
} 