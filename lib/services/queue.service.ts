import { supabase } from '../supabase'

export class QueueService {
  async addToQueue(userId: string, queueNumber: string) {
    const { error } = await supabase
      .from('queue_items')
      .insert({
        user_id: userId,
        queue_number: queueNumber,
        status: 'waiting',
        joined_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error adding to queue:', error)
      throw error
    }
  }

  async getLastQueueNumber(): Promise<number> {
    const { data, error } = await supabase
      .from('queue_items')
      .select('queue_number')
      .order('joined_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching last queue number:', error)
      return 0
    }

    return data ? parseInt(data.queue_number, 10) : 0
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