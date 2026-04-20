<script>
  import { onMount } from 'svelte'
  import { user, profile, loading, initAuth, signOut } from '$lib/auth.js'
  import { goto } from '$app/navigation'

  onMount(() => {
    initAuth()
  })

  async function handleSignOut() {
    await signOut()
    goto('/login')
  }
</script>

<nav>
  <div class="container">
    <a href="/" class="logo">Rhine Appointments</a>
    
    {#if $loading}
      <span class="loading">Loading...</span>
    {:else if $user}
      <ul class="nav-links">
        <li><a href="/">Dashboard</a></li>
        <li><a href="/book">Book Appointment</a></li>
        {#if $profile?.role === 'admin' || $profile?.role === 'employee'}
          <li><a href="/admin">Admin</a></li>
        {/if}
        <li><span class="user">{$user.email}</span></li>
        <li><button on:click={handleSignOut}>Sign Out</button></li>
      </ul>
    {:else}
      <ul class="nav-links">
        <li><a href="/login">Login</a></li>
        <li><a href="/register" class="btn-nav">Sign Up</a></li>
      </ul>
    {/if}
  </div>
</nav>

<main>
  <slot />
</main>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0a0a0f;
    color: #e4e4e7;
    line-height: 1.6;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  nav {
    background: rgba(10, 10, 15, 0.95);
    border-bottom: 1px solid #27272a;
    padding: 16px 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  nav .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #22d3ee;
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 24px;
    list-style: none;
    align-items: center;
  }

  .nav-links a, .nav-links button {
    color: #a1a1aa;
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    text-decoration: none;
  }

  .nav-links a:hover, .nav-links button:hover {
    color: #fff;
  }

  .btn-nav {
    background: #6366f1;
    color: white !important;
    padding: 8px 16px;
    border-radius: 6px;
  }

  .user {
    color: #6366f1;
    font-size: 0.9rem;
  }

  .loading {
    color: #71717a;
  }

  main {
    padding: 40px 0;
    min-height: calc(100vh - 70px);
  }
</style>