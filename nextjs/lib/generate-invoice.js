export function generateInvoice(order, customer) {
  const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice #${order.id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .company { font-size: 24px; font-weight: bold; color: #4f46e5; }
    .invoice-title { font-size: 32px; color: #333; }
    .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .detail-section { }
    .detail-label { font-size: 12px; color: #666; text-transform: uppercase; }
    .detail-value { font-size: 14px; color: #333; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .totals { text-align: right; }
    .totals-row { display: flex; justify-content: flex-end; gap: 60px; padding: 8px 0; }
    .totals-label { color: #666; }
    .totals-value { font-weight: bold; }
    .total-final { font-size: 20px; color: #4f46e5; }
    .footer { margin-top: 60px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">Rhine Solution</div>
    <div class="invoice-title">INVOICE</div>
  </div>
  
  <div class="details">
    <div class="detail-section">
      <div class="detail-label">Bill To</div>
      <div class="detail-value">${customer.name}</div>
      <div class="detail-value">${customer.email}</div>
    </div>
    <div class="detail-section">
      <div class="detail-label">Invoice Number</div>
      <div class="detail-value">INV-${order.id}</div>
      <div class="detail-label" style="margin-top: 12px;">Date</div>
      <div class="detail-value">${new Date().toLocaleDateString()}</div>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity || 1}</td>
          <td>$${item.price}</td>
          <td>$${(item.quantity || 1) * item.price}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="totals">
    <div class="totals-row">
      <span class="totals-label">Subtotal</span>
      <span class="totals-value">$${order.total}</span>
    </div>
    <div class="totals-row">
      <span class="totals-label">Tax</span>
      <span class="totals-value">$0.00</span>
    </div>
    <div class="totals-row">
      <span class="totals-label">Total</span>
      <span class="totals-value total-final">$${order.total}</span>
    </div>
  </div>
  
  <div class="footer">
    Thank you for your business!<br/>
    contact@rhinesolution.com | rhinesolution.com
  </div>
</body>
</html>
`

  return invoiceHTML
}

export function printInvoice(order, customer) {
  const html = generateInvoice(order, customer)
  const printWindow = window.open('', '_blank')
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.print()
}