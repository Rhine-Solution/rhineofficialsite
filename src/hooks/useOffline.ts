import { useState, useEffect, useCallback } from 'react';

const DB_NAME = 'rhine-offline';
const STORE_NAME = 'pending-actions';
const SYNC_INTERVAL = 30000;

interface PendingAction {
  id: string;
  type: string;
  payload: unknown;
  timestamp: number;
}

export function useOffline() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  };

  const getAllFromStore = async <T,>(db: IDBDatabase, storeName: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  };

  const loadPendingActions = useCallback(async () => {
    try {
      const db = await openDB();
      const actions = await getAllFromStore<PendingAction>(db, STORE_NAME);
      setPendingActions(actions);
    } catch (error) {
      console.warn('Failed to load pending actions:', error);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadPendingActions();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadPendingActions]);

  const addToStore = async (db: IDBDatabase, storeName: string, data: PendingAction): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  };

  const deleteFromStore = async (db: IDBDatabase, storeName: string, id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  };

  const queueAction = useCallback(async (type: string, payload: unknown) => {
    const action: PendingAction = {
      id: crypto.randomUUID(),
      type,
      payload,
      timestamp: Date.now(),
    };

    try {
      const db = await openDB();
      await addToStore(db, STORE_NAME, action);
      setPendingActions((prev) => [...prev, action]);
    } catch (error) {
      console.error('Failed to queue action:', error);
    }
  }, []);

  const syncActions = useCallback(async () => {
    if (!isOnline || pendingActions.length === 0) return;

    const db = await openDB();
    for (const action of pendingActions) {
      try {
        await deleteFromStore(db, STORE_NAME, action.id);
        console.log(`Synced action: ${action.type}`, action.payload);
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error);
      }
    }
    setPendingActions([]);
  }, [isOnline, pendingActions]);

  useEffect(() => {
    if (isOnline && pendingActions.length > 0) {
      syncActions();
    }
  }, [isOnline, pendingActions.length, syncActions]);

  useEffect(() => {
    const interval = setInterval(syncActions, SYNC_INTERVAL);
    return () => clearInterval(interval);
  }, [syncActions]);

  return {
    isOnline,
    pendingActions,
    queueAction,
    syncActions,
    hasPendingActions: pendingActions.length > 0,
  };
}

export default useOffline;
