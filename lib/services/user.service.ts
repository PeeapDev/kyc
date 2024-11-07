import { supabase } from '../supabase'

export class UserService {
  async createUser(userData: Omit<User, 'id'>): Promise<string> {
    console.log('Creating user with data:', userData)
    
    try {
      // First check if user exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUserError && existingUserError.code !== 'PGRST116') {
        console.error('Error checking existing user:', existingUserError)
        throw existingUserError
      }

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create the user
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          full_name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone_number: userData.phoneNumber,
          role: userData.role,
          metadata: {
            address: userData.address,
            document_type: userData.documentType,
            document_number: userData.documentNumber,
            profile_photo: userData.profilePhoto
          }
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Error creating user in database:', error);
        throw error;
      }

      console.log('User created successfully:', data);

      return data.id;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }
} 