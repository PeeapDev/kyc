import { supabase } from '../supabase'
import { QCell } from '../qcell'

export interface DashboardSettings {
  id: string;
  userId: string;
  logoUrl: string;
  title: string;
  theme: 'light' | 'dark';
  timeFormat: '12' | '24';
  preferences: Record<string, any>;
}

export class SettingsService {
  private settingsCell: QCell<DashboardSettings>;

  constructor(userId: string) {
    this.settingsCell = new QCell<DashboardSettings>(
      {
        id: '',
        userId,
        logoUrl: '/default-logo.png',
        title: 'KYC Dashboard',
        theme: 'light',
        timeFormat: '12',
        preferences: {}
      },
      'dashboard_settings',
      '*',
      userId
    );
  }

  async getSettings(): Promise<DashboardSettings> {
    try {
      const { data, error } = await supabase
        .from('dashboard_settings')
        .select('*')
        .eq('user_id', this.settingsCell.id)
        .single();

      if (error) throw error;
      
      return this.mapDatabaseSettingsToSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      return this.settingsCell.value;
    }
  }

  async updateSettings(settings: Partial<DashboardSettings>): Promise<void> {
    try {
      const { error } = await supabase
        .from('dashboard_settings')
        .upsert({
          user_id: this.settingsCell.id,
          logo_url: settings.logoUrl,
          title: settings.title,
          theme: settings.theme,
          time_format: settings.timeFormat,
          preferences: settings.preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update the local cell
      const currentSettings = await this.getSettings();
      await this.settingsCell.set({
        ...currentSettings,
        ...settings
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  async uploadLogo(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${this.settingsCell.id}-logo.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('dashboard-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('dashboard-assets')
        .getPublicUrl(filePath);

      await this.updateSettings({ logoUrl: data.publicUrl });
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  }

  subscribeToSettings(callback: (settings: DashboardSettings) => void) {
    return this.settingsCell.subscribe(callback);
  }

  private mapDatabaseSettingsToSettings(dbSettings: any): DashboardSettings {
    return {
      id: dbSettings.id,
      userId: dbSettings.user_id,
      logoUrl: dbSettings.logo_url || '/default-logo.png',
      title: dbSettings.title || 'KYC Dashboard',
      theme: dbSettings.theme || 'light',
      timeFormat: dbSettings.time_format || '12',
      preferences: dbSettings.preferences || {}
    };
  }
} 