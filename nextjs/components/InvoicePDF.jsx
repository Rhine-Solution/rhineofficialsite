import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#3b82f6' },
  section: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  total: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, fontWeight: 'bold' },
  label: { fontSize: 10, color: '#6b7280', marginBottom: 4 },
  value: { fontSize: 12, color: '#111827' },
})

export default function InvoicePDF({ order, customer }) {
  const total = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.total || 0
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>RHINE</Text>
          <Text style={styles.title}>INVOICE</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>Invoice #</Text>
          <Text style={styles.value}>{order.id?.slice(0, 8).toUpperCase()}</Text>
          <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 8 }}>Date: {new Date(order.created_at).toLocaleDateString()}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 8 }}>Bill To:</Text>
          <Text style={styles.value}>{customer?.name || customer?.email || 'Customer'}</Text>
          <Text style={{ fontSize: 11, color: '#4b5563' }}>{customer?.email}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 8 }}>Order Items:</Text>
          {order.items?.length > 0 ? (
            order.items.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text style={{ fontSize: 11 }}>{item.name || item.product_name} x {item.quantity}</Text>
                <Text style={{ fontSize: 11 }}>${((item.price || item.unit_price) * item.quantity).toFixed(2)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.row}>
              <Text style={{ fontSize: 11 }}>Order Total</Text>
              <Text style={{ fontSize: 11 }}>${total.toFixed(2)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.total}>
          <Text style={{ fontSize: 14 }}>Total</Text>
          <Text style={{ fontSize: 14 }}>${total.toFixed(2)}</Text>
        </View>
        
        <View style={{ position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center' }}>
          <Text style={{ fontSize: 10, color: '#9ca3af' }}>Thank you for your business!</Text>
          <Text style={{ fontSize: 9, color: '#9ca3af', marginTop: 4 }}>Rhine Solution - contact@rhinesolution.com</Text>
        </View>
      </Page>
    </Document>
  )
}