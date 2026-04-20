<script>
  import { onMount } from 'svelte'
  import { user, profile } from '$lib/auth.js'
  import { supabase } from '$lib/supabase.js'
  import { goto } from '$app/navigation'

  let appointments = []
  let loading = true

  onMount(async () => {
    if (!$user) {
      goto('/login')
      return
    }
    
    if ($profile?.role !== 'admin' && $profile?.role !== 'employee') {
      goto('/')
      return
    }

    await fetchAppointments()
  })

  async function fetchAppointments() {
    loading = true
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('datetime', { ascending: true })

    if (!error && data) {
      appointments = data
    }
    
    loading = false
  }

  async function updateStatus(id, status) {
    await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)

    await fetchAppointments()
  }

  async function deleteAppointment(id) {
    if (!confirm('Are you sure you want to delete this appointment?')) return
    
    await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    await fetchAppointments()
  }

  function formatDateTime(datetime) {
    const date = new Date(datetime)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
</script>

<div class="admin-page">
  <div class="container">
    <h1>Admin Dashboard</h1>
    <p class="subtitle">Manage all appointments</p>

    {#if loading}
      <p class="loading">Loading...</p>
    {:else}
      <div class="stats">
        <div class="stat">
          <span class="stat-value">{appointments.length}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat pending">
          <span class="stat-value">{appointments.filter(a => a.status === 'pending').length}</span>
          <span class="stat-label">Pending</span>
        </div>
        <div class="stat confirmed">
          <span class="stat-value">{appointments.filter(a => a.status === 'confirmed').length}</span>
          <span class="stat-label">Confirmed</span>
        </div>
        <div class="stat completed">
          <span class="stat-value">{appointments.filter(a => a.status === 'completed').length}</span>
          <span class="stat-label">Completed</span>
        </div>
      </div>

      <div class="appointments-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each appointments as apt}
              <tr>
                <td>{apt.title}</td>
                <td>{formatDateTime(apt.datetime)}</td>
                <td>
                  <span class="status {apt.status}">{apt.status}</span>
                </td>
                <td class="actions">
                  {#if apt.status === 'pending'}
                    <button on:click={() => updateStatus(apt.id, 'confirmed')} class="btn-confirm">
                      Confirm
                    </button>
                  {:else if apt.status === 'confirmed'}
                    <button on:click={() => updateStatus(apt.id, 'completed')} class="btn-complete">
                      Complete
                    </button>
                  {/if}
                  <button on:click={() => deleteAppointment(apt.id)} class="btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>

        {#if appointments.length === 0}
          <p class="empty">No appointments found.</p>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .admin-page {
    max-width: 1000px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 8px;
  }

  .subtitle {
    color: #71717a;
    margin-bottom: 32px;
  }

  .loading {
    text-align: center;
    color: #71717a;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  .stat {
    background: #12121a;
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
  }

  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
  }

  .stat-label {
    color: #71717a;
    font-size: 0.9rem;
  }

  .stat.pending .stat-value { color: #fbbf24; }
  .stat.confirmed .stat-value { color: #22c55e; }
  .stat.completed .stat-value { color: #6366f1; }

  .appointments-table {
    background: #12121a;
    border: 1px solid #27272a;
    border-radius: 12px;
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #27272a;
  }

  th {
    background: #1a1a24;
    font-weight: 600;
    color: #a1a1aa;
  }

  .status {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    text-transform: capitalize;
  }

  .status.pending {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
  }

  .status.confirmed {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
  }

  .status.completed {
    background: rgba(99, 102, 241, 0.2);
    color: #6366f1;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .actions button {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .btn-confirm {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
  }

  .btn-complete {
    background: rgba(99, 102, 241, 0.2);
    color: #6366f1;
  }

  .btn-delete {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }

  .empty {
    padding: 40px;
    text-align: center;
    color: #71717a;
  }

  @media (max-width: 600px) {
    .stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>