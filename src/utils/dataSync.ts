import { offlineStorage } from './offlineStorage';

export interface SyncAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'task' | 'habit' | 'habitEntry' | 'goal' | 'notification';
  data: any;
  timestamp: number;
  synced: boolean;
}

class DataSyncManager {
  private static instance: DataSyncManager;
  private syncQueue: SyncAction[] = [];
  private isSyncing = false;

  static getInstance(): DataSyncManager {
    if (!DataSyncManager.instance) {
      DataSyncManager.instance = new DataSyncManager();
    }
    return DataSyncManager.instance;
  }

  // Add action to sync queue
  async queueAction(action: Omit<SyncAction, 'id' | 'synced'>): Promise<void> {
    const syncAction: SyncAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      synced: false
    };

    this.syncQueue.push(syncAction);
    
    // Save to offline storage
    await offlineStorage.save('syncQueue', this.syncQueue);
    
    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncData();
    }
  }

  // Load sync queue from storage
  async loadSyncQueue(): Promise<void> {
    try {
      const queue = await offlineStorage.get<SyncAction[]>('syncQueue', 'default');
      if (queue && Array.isArray(queue)) {
        this.syncQueue = queue.filter(action => !action.synced);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  // Sync all pending actions
  async syncData(): Promise<void> {
    if (this.isSyncing || !navigator.onLine) return;

    this.isSyncing = true;
    
    try {
      await this.loadSyncQueue();
      
      for (const action of this.syncQueue) {
        if (action.synced) continue;
        
        try {
          await this.syncAction(action);
          action.synced = true;
        } catch (error) {
          console.error('Failed to sync action:', action, error);
          // Keep action in queue for retry
        }
      }
      
      // Remove synced actions
      this.syncQueue = this.syncQueue.filter(action => !action.synced);
      await offlineStorage.save('syncQueue', this.syncQueue);
      
    } catch (error) {
      console.error('Sync process failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Sync individual action (placeholder for actual API calls)
  private async syncAction(action: SyncAction): Promise<void> {
    // In a real app, this would make API calls to sync with server
    console.log('Syncing action:', action);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // For now, just mark as synced since we don't have a backend
    return Promise.resolve();
  }

  // Get pending sync count
  getPendingSyncCount(): number {
    return this.syncQueue.filter(action => !action.synced).length;
  }

  // Clear all sync data (for testing)
  async clearSyncQueue(): Promise<void> {
    this.syncQueue = [];
    await offlineStorage.delete('syncQueue', 'default');
  }

  // Force sync (for manual trigger)
  async forcSync(): Promise<void> {
    if (navigator.onLine) {
      await this.syncData();
    }
  }
}

export const dataSyncManager = DataSyncManager.getInstance();

// Auto-sync when coming back online
window.addEventListener('online', () => {
  dataSyncManager.syncData();
});

// Utility functions for common sync operations
export const syncHelpers = {
  // Queue task operations
  queueTaskAction: (type: 'create' | 'update' | 'delete', data: any) => {
    return dataSyncManager.queueAction({
      type,
      entity: 'task',
      data,
      timestamp: Date.now()
    });
  },

  // Queue habit operations
  queueHabitAction: (type: 'create' | 'update' | 'delete', data: any) => {
    return dataSyncManager.queueAction({
      type,
      entity: 'habit',
      data,
      timestamp: Date.now()
    });
  },

  // Queue habit entry operations
  queueHabitEntryAction: (type: 'create' | 'update' | 'delete', data: any) => {
    return dataSyncManager.queueAction({
      type,
      entity: 'habitEntry',
      data,
      timestamp: Date.now()
    });
  },

  // Get sync status
  getSyncStatus: () => ({
    pendingCount: dataSyncManager.getPendingSyncCount(),
    isOnline: navigator.onLine
  })
};
