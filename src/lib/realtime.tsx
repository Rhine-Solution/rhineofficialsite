import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface RealtimeUser {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  cursor?: { x: number; y: number };
}

interface PresenceState {
  users: Map<string, RealtimeUser>;
  updateUser: (id: string, data: Partial<RealtimeUser>) => void;
  removeUser: (id: string) => void;
  setUsers: (users: Map<string, RealtimeUser>) => void;
}

const PresenceContext = createContext<PresenceState | null>(null);

export function PresenceProvider({ children, channelName = 'presence' }: { children: ReactNode; channelName?: string }) {
  const [users, setUsers] = useState<Map<string, RealtimeUser>>(new Map());

  const updateUser = useCallback((id: string, data: Partial<RealtimeUser>) => {
    setUsers(prev => {
      const next = new Map(prev);
      const existing = next.get(id) || { id, name: 'Anonymous' };
      next.set(id, { ...existing, ...data });
      return next;
    });
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <PresenceContext.Provider value={{ users, updateUser, removeUser, setUsers }}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error('usePresence must be used within PresenceProvider');
  }
  return context;
}

// Live cursors component
interface LiveCursorsProps {
  channelName?: string;
}

export function LiveCursors({ channelName = 'cursors' }: LiveCursorsProps) {
  const { users } = usePresence();
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {Array.from(users.values()).map(user => (
        user.cursor && (
          <div
            key={user.id}
            className="absolute transition-all duration-100"
            style={{
              left: user.cursor.x,
              top: user.cursor.y,
            }}
          >
            <svg className="w-5 h-5 text-brand-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L6.35 3.21a.5.5 0 0 0-.85.35Z" />
            </svg>
            <span className="absolute -top-6 left-4 text-xs bg-black/80 px-2 py-1 rounded text-white whitespace-nowrap">
              {user.name}
            </span>
          </div>
        )
      ))}
    </div>
  );
}

// Collaborative editing state
interface CollabState {
  documentId: string;
  content: string;
  version: number;
  users: Set<string>;
  pendingChanges: Map<string, string>;
}

interface CollabOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  text?: string;
  length?: number;
  userId: string;
  timestamp: number;
}

// CRDT-like implementation for conflict-free editing
export class CollaborativeDocument {
  private state: CollabState;
  private operations: CollabOperation[] = [];

  constructor(documentId: string, initialContent = '') {
    this.state = {
      documentId,
      content: initialContent,
      version: 0,
      users: new Set(),
      pendingChanges: new Map(),
    };
  }

  applyOperation(op: Omit<CollabOperation, 'timestamp'>): void {
    const operation: CollabOperation = { ...op, timestamp: Date.now() };
    
    switch (op.type) {
      case 'insert':
        if (op.text && op.position <= this.state.content.length) {
          this.state.content = 
            this.state.content.slice(0, op.position) + 
            op.text + 
            this.state.content.slice(op.position);
        }
        break;
      case 'delete':
        if (op.length && op.position < this.state.content.length) {
          this.state.content = 
            this.state.content.slice(0, op.position) + 
            this.state.content.slice(op.position + op.length);
        }
        break;
    }
    
    this.operations.push(operation);
    this.state.version++;
  }

  getState(): CollabState {
    return { ...this.state };
  }

  getOperations(): CollabOperation[] {
    return [...this.operations];
  }
}

export default CollaborativeDocument;
