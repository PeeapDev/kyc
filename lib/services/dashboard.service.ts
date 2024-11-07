import { supabase } from '../supabase'
import { QCell } from '../qcell'

export interface DashboardData {
  layout: any[];
  widgets: any[];
  theme: string;
  preferences: Record<string, any>;
}

export class DashboardService {
  private settingsCell: QCell<DashboardData>;

  constructor(userId: string) {
    this.settingsCell = new QCell<DashboardData>(
      {
        layout: [],
        widgets: [],
        theme: 'light',
        preferences: {}
      },
      'dashboard_settings',
      '*',
      userId
    );
  }

  async getDashboardSettings(): Promise<DashboardData> {
    return this.settingsCell.get();
  }

  async updateDashboardSettings(data: Partial<DashboardData>): Promise<void> {
    const current = await this.settingsCell.get();
    await this.settingsCell.set({ ...current, ...data });
  }

  subscribeToChanges(callback: (data: DashboardData) => void) {
    return this.settingsCell.subscribe(callback);
  }
} 