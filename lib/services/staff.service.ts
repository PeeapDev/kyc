import { supabase } from '../supabase'
import { QCell } from '../qcell'

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  homeAddress: string;
  idPassportNumber: string;
  role: string;
  profilePhoto?: string;
}

export class StaffService {
  async addStaff(staffData: Omit<StaffMember, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        full_name: `${staffData.firstName} ${staffData.lastName}`,
        email: staffData.email,
        phone_number: staffData.phoneNumber,
        role: staffData.role,
        metadata: {
          home_address: staffData.homeAddress,
          id_passport: staffData.idPassportNumber,
          profile_photo: staffData.profilePhoto
        }
      }])
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async getStaffMember(id: string): Promise<StaffMember | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      firstName: data.full_name?.split(' ')[0] || '',
      lastName: data.full_name?.split(' ')[1] || '',
      email: data.email,
      phoneNumber: data.phone_number || '',
      homeAddress: data.metadata?.home_address || '',
      idPassportNumber: data.metadata?.id_passport || '',
      role: data.role,
      profilePhoto: data.metadata?.profile_photo
    };
  }
} 