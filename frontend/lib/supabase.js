// Supabase Client Configuration
// Note: This is the public anon key - safe for client-side use
const SUPABASE_URL = window.ENV?.SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co';
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM';

class SupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      ...options.headers
    };

    try {
      const response = await fetch(`${this.url}/rest/v1/${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Supabase request error:', error);
      throw error;
    }
  }

  // Projects
  async getProjects() {
    return this.request('projects?select=*&order=created_at.desc');
  }

  async getFeaturedProjects() {
    return this.request('projects?select=*&featured=eq.true&order=created_at.desc');
  }

  async getProject(id) {
    const results = await this.request(`projects?id=eq.${id}&select=*`);
    return results[0] || null;
  }

  // Products (for potential shop)
  async getProducts() {
    return this.request('products?select=*&order=created_at.desc');
  }

  // Books (for portfolio)
  async getBooks() {
    return this.request('books?select=*&order=added_at.desc');
  }

  // Appointments (for scheduling)
  async getAppointments() {
    return this.request('appointments?select=*&order=datetime.asc');
  }

  // Contact form submissions
  async saveContact(data) {
    return this.request('contacts', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject || '',
        message: data.message,
        created_at: new Date().toISOString()
      })
    });
  }

  async getContactsByEmail(email) {
    return this.request(`contacts?email=eq.${encodeURIComponent(email)}&order=created_at.desc`);
  }

  async getUserProfile(email) {
    const results = await this.request(`users?email=eq.${encodeURIComponent(email)}&select=*`);
    return results[0] || null;
  }

  // File Storage
  async uploadFile(file, folder = 'uploads') {
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', fileName);

    const response = await fetch(`${this.url}/storage/v1/object/${fileName}`, {
      method: 'POST',
      headers: {
        'apikey': this.key,
        'Authorization': `Bearer ${this.key}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return `${this.url}/storage/v1/object/public/${fileName}`;
  }

  async listFiles(folder = 'uploads') {
    return this.request(`storage/v1/object/list/public/${folder}`);
  }
}

const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabase = supabase;