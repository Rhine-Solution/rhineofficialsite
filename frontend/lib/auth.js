// Supabase Auth Client
const SUPABASE_URL = 'https://crqjedivobupxbbathux.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM';

class AuthClient {
  constructor() {
    this.session = null;
    this.user = null;
  }

  async signUp(email, password, name) {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          email,
          password,
          data: { name }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Create user profile in database
      if (!data.error) {
        await this.createUserProfile(data.id, email, name);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signIn(email, password) {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error_description || data.error.message);
      }

      this.session = data;
      this.user = data.user;
      this.saveSession(data);

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      const session = this.getSession();
      if (!session) return { success: true };

      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      this.clearSession();
      return { success: true };
    } catch (error) {
      this.clearSession();
      return { success: true };
    }
  }

  async createUserProfile(userId, email, name) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          id: userId,
          email,
          name,
          role: 'user'
        })
      });
    } catch (e) {
      console.log('Could not create profile');
    }
  }

  saveSession(data) {
    localStorage.setItem('supabase_session', JSON.stringify(data));
  }

  getSession() {
    const stored = localStorage.getItem('supabase_session');
    return stored ? JSON.parse(stored) : null;
  }

  clearSession() {
    localStorage.removeItem('supabase_session');
    this.session = null;
    this.user = null;
  }

  isAuthenticated() {
    const session = this.getSession();
    if (!session) return false;
    
    // Check if token is expired
    if (session.expires_at * 1000 < Date.now()) {
      this.clearSession();
      return false;
    }
    
    return true;
  }

  getUser() {
    const session = this.getSession();
    return session?.user || null;
  }
}

const auth = new AuthClient();
window.auth = auth;