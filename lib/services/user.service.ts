import { supabase } from '../supabase'

export class UserService {
  async createUser(userData: Omit<User, 'id'>): Promise<string> {
    console.log('Starting user creation with data:', userData);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          full_name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone_number: userData.phoneNumber,
          role: userData.role || 'user',
          metadata: {
            address: userData.address,
            document_type: userData.documentType,
            document_number: userData.documentNumber
          }
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      console.log('User created successfully:', data);
      return data.id;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    console.log('Searching users with query:', query);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`phone_number.ilike.%${query}%,email.ilike.%${query}%,full_name.ilike.%${query}%`);

      if (error) {
        console.error('Error searching users:', error);
        throw error;
      }

      console.log('Found users:', data);
      return data.map(this.mapDatabaseUserToUser);
    } catch (error) {
      console.error('Error in searchUsers:', error);
      throw error;
    }
  }

  private mapDatabaseUserToUser(dbUser: any): User {
    const names = dbUser.full_name?.split(' ') || ['', ''];
    const metadata = dbUser.metadata || {};
    
    return {
      id: dbUser.id,
      firstName: names[0],
      lastName: names[1] || '',
      email: dbUser.email,
      phoneNumber: dbUser.phone_number || '',
      address: metadata.address || '',
      documentType: metadata.document_type || '',
      documentNumber: metadata.document_number || '',
      role: dbUser.role || 'user'
    };
  }
} 