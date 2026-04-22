import { renderToStream } from '@react-pdf/renderer'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { 
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) 
        }
      }
    }
  )
}

export async function GET(request, { params }) {
  const { orderId } = params
  const supabase = await getSupabase()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*), user:user_id(email, user_metadata)')
    .eq('id', orderId)
    .single()
  
  if (error || !order) {
    return new Response('Order not found', { status: 404 })
  }
  
  if (order.user_id !== user.id && user.user_metadata?.role !== 'admin') {
    return new Response('Forbidden', { status: 403 })
  }
  
  const customer = order.user || { email: user.email }
  
  const stream = await renderToStream(
    <InvoicePDF order={order} customer={customer} />
  )
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Rhine-Invoice-${orderId.slice(0, 8)}.pdf"`,
    },
  })
}