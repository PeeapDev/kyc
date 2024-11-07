import { supabase } from '../supabase'

export interface KYCApplication {
  id: string;
  name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Review';
  progress: number;
}

export class ApplicationsService {
  async getApplications(): Promise<KYCApplication[]> {
    const { data, error } = await supabase
      .from('kyc_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateApplicationStatus(
    id: string, 
    status: KYCApplication['status'], 
    progress: number
  ): Promise<void> {
    const { error } = await supabase
      .from('kyc_applications')
      .update({ status, progress })
      .eq('id', id);

    if (error) throw error;
  }

  subscribeToApplications(callback: (applications: KYCApplication[]) => void) {
    return supabase
      .channel('kyc_applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kyc_applications'
        },
        async () => {
          // Fetch updated data when changes occur
          const { data } = await this.getApplications();
          if (data) callback(data);
        }
      )
      .subscribe();
  }
} 