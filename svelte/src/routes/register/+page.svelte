<script>
  import { signUp } from '$lib/auth.js'
  import { goto } from '$app/navigation'

  let name = ''
  let email = ''
  let password = ''
  let role = 'client'
  let error = ''
  let loading = false

  async function handleSubmit() {
    loading = true
    error = ''
    
    const result = await signUp(email, password, name, role)
    
    if (result.error) {
      error = result.error
    } else {
      goto('/')
    }
    
    loading = false
  }
</script>

<div class="auth-page">
  <div class="auth-card">
    <h1>Create Account</h1>
    <p class="subtitle">Join us to book appointments.</p>

    {#if error}
      <div class="error">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="name">Full Name</label>
        <input 
          type="text" 
          id="name" 
          bind:value={name} 
          required 
          placeholder="John Doe"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          bind:value={email} 
          required 
          placeholder="you@example.com"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          bind:value={password} 
          required 
          placeholder="••••••••"
          minlength="6"
        />
      </div>

      <div class="form-group">
        <label for="role">Account Type</label>
        <select id="role" bind:value={role}>
          <option value="client">Client</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="submit" class="btn" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>

    <p class="switch">
      Already have an account? <a href="/login">Sign in</a>
    </p>
  </div>
</div>

<style>
  .auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
  }

  .auth-card {
    background: #12121a;
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
  }

  h1 {
    text-align: center;
    margin-bottom: 8px;
  }

  .subtitle {
    text-align: center;
    color: #71717a;
    margin-bottom: 24px;
  }

  .error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    color: #ef4444;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 0.9rem;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #a1a1aa;
  }

  input, select {
    width: 100%;
    padding: 12px;
    background: #0a0a0f;
    border: 1px solid #27272a;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #6366f1;
  }

  .btn {
    width: 100%;
    padding: 12px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 8px;
  }

  .btn:hover:not(:disabled) {
    background: #818cf8;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .switch {
    text-align: center;
    margin-top: 20px;
    color: #71717a;
  }

  .switch a {
    color: #6366f1;
    text-decoration: none;
  }
</style>