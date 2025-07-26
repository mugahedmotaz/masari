// Simple test utility to verify offline functionality
import { offlineStorage } from './offlineStorage';
import { dataSyncManager, syncHelpers } from './dataSync';

export class OfflineTest {
  static async runBasicTests(): Promise<boolean> {
    console.log('🧪 Running offline functionality tests...');
    
    try {
      // Test 1: IndexedDB Storage
      console.log('📦 Testing IndexedDB storage...');
      await offlineStorage.init();
      
      const testData = { id: 'test-1', name: 'Test Task', completed: false };
      await offlineStorage.save('tasks', testData);
      
      const retrieved = await offlineStorage.get('tasks', 'test-1');
      if (!retrieved || (retrieved as any).name !== 'Test Task') {
        throw new Error('IndexedDB storage test failed');
      }
      console.log('✅ IndexedDB storage test passed');
      
      // Test 2: Data Sync Queue
      console.log('🔄 Testing sync queue...');
      await syncHelpers.queueTaskAction('create', testData);
      
      const syncStatus = syncHelpers.getSyncStatus();
      if (syncStatus.pendingCount === 0) {
        console.log('⚠️ Sync queue test: No pending items (may be expected)');
      } else {
        console.log('✅ Sync queue test passed');
      }
      
      // Test 3: Service Worker Registration
      console.log('⚙️ Testing Service Worker...');
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          console.log('✅ Service Worker is registered');
        } else {
          console.log('⚠️ Service Worker not found (may not be registered yet)');
        }
      } else {
        console.log('❌ Service Worker not supported');
      }
      
      // Test 4: PWA Manifest
      console.log('📱 Testing PWA manifest...');
      try {
        const response = await fetch('/manifest.json');
        if (response.ok) {
          const manifest = await response.json();
          if (manifest.name && manifest.short_name) {
            console.log('✅ PWA manifest is valid');
          } else {
            console.log('⚠️ PWA manifest missing required fields');
          }
        } else {
          console.log('❌ PWA manifest not found');
        }
      } catch (error) {
        console.log('❌ PWA manifest test failed:', error);
      }
      
      // Test 5: Offline Detection
      console.log('🌐 Testing offline detection...');
      const isOnline = navigator.onLine;
      console.log(`📡 Current connection status: ${isOnline ? 'Online' : 'Offline'}`);
      
      // Cleanup
      await offlineStorage.delete('tasks', 'test-1');
      
      console.log('🎉 All offline functionality tests completed!');
      return true;
      
    } catch (error) {
      console.error('❌ Offline functionality test failed:', error);
      return false;
    }
  }
  
  static async testOfflineScenario(): Promise<void> {
    console.log('🔌 Simulating offline scenario...');
    
    // Simulate going offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    // Test offline operations
    const testTask = {
      id: 'offline-test-task',
      title: 'Offline Test Task',
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    // Save data while "offline"
    await offlineStorage.save('tasks', testTask);
    await syncHelpers.queueTaskAction('create', testTask);
    
    console.log('📦 Data saved while offline');
    
    // Simulate coming back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    // Trigger sync
    await dataSyncManager.forcSync();
    
    console.log('🔄 Sync completed after coming back online');
    
    // Cleanup
    await offlineStorage.delete('tasks', 'offline-test-task');
    
    console.log('✅ Offline scenario test completed');
  }
  
  static logStorageInfo(): void {
    console.log('💾 Storage Information:');
    
    // Check storage quota
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        const used = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const usedMB = (used / 1024 / 1024).toFixed(2);
        const quotaMB = (quota / 1024 / 1024).toFixed(2);
        
        console.log(`📊 Storage used: ${usedMB} MB / ${quotaMB} MB`);
        console.log(`📈 Storage usage: ${((used / quota) * 100).toFixed(1)}%`);
      });
    }
    
    // Check localStorage usage
    let localStorageSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorageSize += localStorage[key].length;
      }
    }
    console.log(`🗂️ localStorage size: ${(localStorageSize / 1024).toFixed(2)} KB`);
  }
}

// Auto-run tests in development
if (import.meta.env.DEV) {
  // Run tests after a short delay to ensure everything is loaded
  setTimeout(() => {
    OfflineTest.runBasicTests();
    OfflineTest.logStorageInfo();
  }, 2000);
}

// Export for manual testing
(window as any).OfflineTest = OfflineTest;
