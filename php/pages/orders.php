<?php
// Orders Page - Protected Route
if (!is_logged_in()) {
    redirect('?page=login');
    exit;
}

$orders = [
    ['id' => 'ORD-001', 'date' => '2026-04-15', 'total' => 229.98, 'status' => 'delivered'],
    ['id' => 'ORD-002', 'date' => '2026-04-10', 'total' => 149.99, 'status' => 'shipped'],
];
?>
<h1 style="margin-bottom: 24px;">My Orders</h1>

<?php if (empty($orders)): ?>
    <p style="color: #a1a1aa; text-align: center; padding: 40px;">No orders yet. <a href="?page=products" style="color: #6366f1;">Start shopping</a></p>
<?php else: ?>
    <?php foreach ($orders as $order): ?>
    <div style="background: #12121a; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
                <strong><?= $order['id'] ?></strong>
                <p style="color: #a1a1aa; font-size: 0.9rem;"><?= $order['date'] ?></p>
            </div>
            <div style="text-align: right;">
                <span style="padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; 
                    background: <?= $order['status'] === 'delivered' ? 'rgba(34,197,94,0.2)' : 'rgba(251,191,36,0.2)' ?>;
                    color: <?= $order['status'] === 'delivered' ? '#22c55e' : '#fbbf24' ?>;">
                    <?= ucfirst($order['status']) ?>
                </span>
            </div>
        </div>
        <div style="font-size: 1.2rem; font-weight: 600;">
            Total: $<?= number_format($order['total'], 2) ?>
        </div>
    </div>
    <?php endforeach; ?>
<?php endif; ?>