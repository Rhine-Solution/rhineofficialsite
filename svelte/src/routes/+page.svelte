<script>
  import { onMount } from 'svelte'
  import { user, profile } from '$lib/auth.js'
  import { supabase } from '$lib/supabase.js'

  let appointments = []
  let loading = true
  let showBookingForm = false
  let selectedDate = ''
  let selectedTime = ''
  let appointmentTitle = ''

  onMount(async () => {
    await fetchAppointments()
  })

  async function fetchAppointments() {
    if (!$user) return
    
    loading = true
    
    let query = supabase
      .from('appointments')
      .select('*')
      .order('datetime', { ascending: true })
    
    // Clients see their own, employees/admins see all
    if ($profile?.role === 'client') {
      query = query.eq('user_id', $user.id)
    }
    
    const { data, error } = await query
    
    if (!error && data) {
      appointments = data
    }
    
    loading = false
  }

  async function bookAppointment() {
    if (!selectedDate || !selectedTime || !appointmentTitle) return
    
    const datetime = `${selectedDate}T${selectedTime}:00`
    
    const { error } = await supabase.from('appointments').insert({
      user_id: $user.id,
      title: appointmentTitle,
      datetime: datetime,
      duration_minutes: 60,
      status: 'pending'
    })
    
    if (!error) {
      showBookingForm = false
      appointmentTitle = ''
      selectedDate = ''
      selectedTime = ''
      await fetchAppointments()
      alert('Appointment booked successfully!')
    }
  }

  function formatDate(datetime) {
    const date = new Date(datetime)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function formatTime(datetime) {
    const date = new Date(datetime)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
</script>

<nav>
  <div class="container">
    <a href="/" class="logo">Appointments</a>
    <ul class="nav-links">
      <li><a href="/">Dashboard</a></li>
      <li><button on:click={() => showBookingForm = !showBookingForm}>
        {showBookingForm ? 'Cancel' : 'New Booking'}
      </button></li>
    </ul>
  </div>
</nav>

<main>
  <div class="container">
    <section class="hero">
      <h1>Appointment Dashboard</h1>
      <p>Manage your scheduled appointments and book new ones.</p>
      {#if $profile}
        <span class="role-badge">{$profile.role}</span>
      {/if}
    </section>

    {#if $user}
      {#if showBookingForm}
        <section class="booking-form">
          <h2>Book New Appointment</h2>
          <form on:submit|preventDefault={bookAppointment}>
            <div class="form-group">
              <label for="title">Appointment Title</label>
              <input type="text" id="title" bind:value={appointmentTitle} required placeholder="e.g., Consultation" />
            </div>
            <div class="form-group">
              <label for="date">Date</label>
              <input type="date" id="date" bind:value={selectedDate} required />
            </div>
            <div class="form-group">
              <label for="time">Time</label>
              <input type="time" id="time" bind:value={selectedTime} required />
            </div>
            <button type="submit" class="btn">Book Appointment</button>
          </form>
        </section>
      {/if}

      <section class="appointments">
        <h2>
          {$profile?.role === 'client' ? 'Your Appointments' : 'All Appointments'}
        </h2>
        
        {#if loading}
          <p class="loading">Loading appointments...</p>
        {:else if appointments.length === 0}
          <p class="empty">No appointments found.</p>
        {:else}
          <div class="appointment-list">
            {#each appointments as apt}
              <div class="appointment-card">
                <div class="appointment-date">
                  <span class="day">{new Date(apt.datetime).getDate()}</span>
                  <span class="month">{new Date(apt.datetime).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div class="appointment-details">
                  <h3>{apt.title}</h3>
                  <p>{formatTime(apt.datetime)}</p>
                </div>
                <div class="appointment-status" class:confirmed={apt.status === 'confirmed'} class:pending={apt.status === 'pending'}>
                  {apt.status}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    {:else}
      <div class="not-logged-in">
        <p>Please <a href="/login">sign in</a> to view your appointments.</p>
      </div>
    {/if}
  </div>
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
  }

  .nav-links {
    display: flex;
    gap: 24px;
    list-style: none;
  }

  .nav-links a, .nav-links button {
    color: #a1a1aa;
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
  }

  .nav-links a:hover, .nav-links button:hover {
    color: #fff;
  }

  main {
    padding: 40px 0;
  }

  .hero {
    text-align: center;
    padding: 40px 0;
  }

  .hero h1 {
    font-size: 2.5rem;
    margin-bottom: 8px;
  }

  .hero p {
    color: #a1a1aa;
  }

  .role-badge {
    display: inline-block;
    background: #6366f1;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    margin-top: 12px;
    text-transform: capitalize;
  }

  .loading, .empty {
    text-align: center;
    color: #71717a;
    padding: 40px;
  }

  .not-logged-in {
    text-align: center;
    padding: 40px;
    background: #12121a;
    border-radius: 12px;
  }

  .not-logged-in a {
    color: #6366f1;
  }

  .appointment-status.pending {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
  }

  .booking-form {
    background: #12121a;
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 40px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .booking-form h2 {
    margin-bottom: 24px;
    text-align: center;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .form-group input {
    width: 100%;
    padding: 12px;
    background: #0a0a0f;
    border: 1px solid #27272a;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
  }

  .form-group input:focus {
    outline: none;
    border-color: #6366f1;
  }

  .btn {
    display: inline-block;
    padding: 12px 24px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }

  .btn:hover {
    background: #818cf8;
  }

  .appointments h2 {
    margin-bottom: 24px;
  }

  .appointment-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .appointment-card {
    display: flex;
    align-items: center;
    gap: 20px;
    background: #12121a;
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 20px;
  }

  .appointment-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #1a1a24;
    padding: 12px 16px;
    border-radius: 8px;
    min-width: 70px;
  }

  .appointment-date .day {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .appointment-date .month {
    font-size: 0.8rem;
    color: #a1a1aa;
  }

  .appointment-details {
    flex: 1;
  }

  .appointment-details h3 {
    margin-bottom: 4px;
  }

  .appointment-details p {
    color: #a1a1aa;
    font-size: 0.9rem;
  }

  .appointment-status {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
  }

  .appointment-status.confirmed {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
  }

  @media (max-width: 600px) {
    .appointment-card {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>