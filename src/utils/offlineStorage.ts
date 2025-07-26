// IndexedDB wrapper for offline storage
class OfflineStorage {
  private dbName = 'GrothDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
          taskStore.createIndex('completed', 'completed', { unique: false });
          taskStore.createIndex('dueDate', 'dueDate', { unique: false });
        }

        if (!db.objectStoreNames.contains('habits')) {
          const habitStore = db.createObjectStore('habits', { keyPath: 'id' });
          habitStore.createIndex('isActive', 'isActive', { unique: false });
        }

        if (!db.objectStoreNames.contains('habitEntries')) {
          const entryStore = db.createObjectStore('habitEntries', { keyPath: 'id' });
          entryStore.createIndex('habitId', 'habitId', { unique: false });
          entryStore.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('goals')) {
          const goalStore = db.createObjectStore('goals', { keyPath: 'id' });
          goalStore.createIndex('completed', 'completed', { unique: false });
        }

        if (!db.objectStoreNames.contains('notifications')) {
          const notificationStore = db.createObjectStore('notifications', { keyPath: 'id' });
          notificationStore.createIndex('read', 'read', { unique: false });
          notificationStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('pendingActions')) {
          db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async save<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Queue actions for when back online
  async queueAction(action: {
    type: string;
    data: any;
    timestamp: number;
  }): Promise<void> {
    await this.save('pendingActions', {
      ...action,
      id: Date.now() + Math.random()
    });
  }

  async getPendingActions(): Promise<any[]> {
    return this.getAll('pendingActions');
  }

  async clearPendingActions(): Promise<void> {
    return this.clear('pendingActions');
  }
}

export const offlineStorage = new OfflineStorage();

// Sync manager for handling offline/online state
export class SyncManager {
  private static instance: SyncManager;
  private isOnline = navigator.onLine;
  private syncInProgress = false;

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  constructor() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  private handleOnline(): void {
    this.isOnline = true;
    this.syncPendingActions();
  }

  private handleOffline(): void {
    this.isOnline = false;
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  private async syncPendingActions(): Promise<void> {
    if (this.syncInProgress) return;
    
    this.syncInProgress = true;
    
    try {
      const pendingActions = await offlineStorage.getPendingActions();
      
      for (const action of pendingActions) {
        try {
          // Process each pending action
          await this.processAction(action);
        } catch (error) {
          console.error('Failed to sync action:', action, error);
        }
      }
      
      // Clear processed actions
      await offlineStorage.clearPendingActions();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processAction(action: any): Promise<void> {
    // This would typically make API calls to sync with server
    // For now, we'll just log the action
    console.log('Processing offline action:', action);
  }

  async saveOffline<T>(storeName: string, data: T): Promise<void> {
    await offlineStorage.save(storeName, data);
    
    if (!this.isOnline) {
      // Queue for sync when back online
      await offlineStorage.queueAction({
        type: 'save',
        data: { storeName, data },
        timestamp: Date.now()
      });
    }
  }
}

export const syncManager = SyncManager.getInstance();
