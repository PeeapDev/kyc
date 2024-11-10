import { supabase } from '../supabase'

export interface AppSettings {
  id?: string;
  logo_url?: string;
  company_name?: string;
  theme?: string;
}

export class SettingsService {
  async uploadLogo(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `logo.${fileExt}`
      const filePath = `public/${fileName}`

      // Upload logo to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('settings')
        .upload(filePath, file, {
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('settings')
        .getPublicUrl(filePath)

      // Save URL to settings table
      const { error: dbError } = await supabase
        .from('app_settings')
        .upsert({ 
          logo_url: data.publicUrl 
        })

      if (dbError) throw dbError

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading logo:', error)
      throw error
    }
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single()

      if (error) throw error
      return data || {}
    } catch (error) {
      console.error('Error getting settings:', error)
      return {}
    }
  }
} 