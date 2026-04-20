<script>
  import { user } from '$lib/auth.js'
  import { supabase } from '$lib/supabase.js'
  import { goto } from '$app/navigation'

  let title = ''
  let description = ''
  let date = ''
  let time = ''
  let loading = false
  let success = false
  let error = ''

  async function handleSubmit() {
    if (!title || !date || !time) {
      error = 'Please fill in all required fields'
      return
    }

    loading = true
    error = ''

    const datetime = `${date}T${time}:00`

    const { error: err } = await supabase.from('appointments').insert({
      user_id: $user.id,
      title,
      description,
      datetime,
      duration_minutes: 60,
      status: 'pending'
    })

    if (err) {
      error = err.message
      loading = false
    } else {
      success = true
      loading = false
      setTimeout(() => goto('/'), 2000)
    }
  }
</script>

<div class="book-page">
  <div class="container">
    <h1>Book an Appointment</h1>
    <p class="subtitle">Schedule a time with us.</p>

    {#if success}
      <div class="success">
        <h2>Appointment Booked!</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    {:else}
      {#if error}
        <div class="error">{error}</div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="booking-form">
        <div class="form-group">
          <label for="title">Appointment Title *</label>
          <input 
            type="text" 
            id="title" 
            bind:value={title} 
            required 
            placeholder="e.g., Consultation, Design Review"
          />
        </div>

        <div class="form-group">
          <label for="description">Description (optional)</label>
          <textarea 
            id="description" 
            bind:value={description}
            placeholder="Tell us about what you need..."
            rows="4"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Date *</label>
            <input 
              type="date" 
              id="date" 
              bind:value={date} 
              required 
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div class="form-group">
            <label for="time">Time *</label>
            <input 
              type="time" 
              id="time" 
              bind:value={time} 
              required 
            />
          </div>
        </div>

        <button type="submit" class="btn" disabled={loading}>
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    {/if}
  </div>
</div>

<style>
  .book-page {
    max-width: 600px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    margin-bottom: 8px;
  }

  .subtitle {
    text-align: center;
    color: #71717a;
    margin-bottom: 32px;
  }

  .success {
    text-align: center;
    padding: 40px;
    background: #12121a;
    border-radius: 12px;
  }

  .success h2 {
    color: #22c55e;
    margin-bottom: 8px;
  }

  .error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    color: #ef4444;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .booking-form {
    background: #12121a;
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 32px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #a1a1aa;
  }

  input, textarea {
    width: 100%;
    padding: 12px;
    background: #0a0a0f;
    border: 1px solid #27272a;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    font-family: inherit;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #6366f1;
  }

  .btn {
    width: 100%;
    padding: 14px;
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

  @media (max-width: 600px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>