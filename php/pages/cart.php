<?php
// Cart Page - Fetch products from Supabase

function fetchProductsFromSupabase() {
    $url = SUPABASE_URL . '/rest/v1/products?select=id,name,price';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    if (is_array($data)) {
        $products = [];
        foreach ($data as $p) {
            $products[$p['id']] = $p;
        }
        return $products;
    }
    return [];
}

// Fallback products
$fallback_products = [
    '1' => ['name' => 'Developer Keyboard', 'price' => 149.99],
    '2' => ['name' => 'Wireless Mouse', 'price' => 79.99],
    '3' => ['name' => 'HD Monitor', 'price' => 299.99],
    '4' => ['name' => 'USB-C Hub', 'price' => 49.99],
    '5' => ['name' => 'Webcam HD', 'price' => 89.99],
    '6' => ['name' => 'Desk Lamp', 'price' => 39.99],
];

$products = fetchProductsFromSupabase();
if (empty($products)) {
    $products = $fallback_products;
}

$cart = $_SESSION['cart'] ?? [];
$cart_items = [];
$total = 0;

foreach ($cart as $product_id => $quantity) {
    if (isset($products[$product_id])) {
        $product = $products[$product_id];
        $price = is_array($product) ? ($product['price'] ?? 0) : 0;
        $name = is_array($product) ? ($product['name'] ?? 'Product') : $product;
        $subtotal = $price * $quantity;
        $cart_items[] = [
            'id' => $product_id,
            'name' => $name,
            'price' => $price,
            'quantity' => $quantity,
            'subtotal' => $subtotal
        ];
        $total += $subtotal;
    }
}

// Clear cart
if (isset($_POST['clear_cart'])) {
    $_SESSION['cart'] = [];
    redirect('?page=cart');
}

// Checkout
if (isset($_POST['checkout']) && is_logged_in()) {
    // In production, save order to database
    $_SESSION['cart'] = [];
    echo '<div class="alert alert-success">Order placed successfully!</div>';
    $cart_items = [];
    $total = 0;
}
?>
<h1 style="margin-bottom: 24px;">Shopping Cart</h1>

<?php if (empty($cart_items)): ?>
    <p style="color: #a1a1aa; text-align: center; padding: 40px;">Your cart is empty. <a href="?page=products" style="color: #6366f1;">Browse products</a></p>
<?php else: ?>
    <?php foreach ($cart_items as $item): ?>
    <div class="cart-item">
        <div>
            <strong><?= sanitize($item['name']) ?></strong>
            <p style="color: #a1a1aa; font-size: 0.9rem;">Qty: <?= $item['quantity'] ?> × $<?= number_format($item['price'], 2) ?></p>
        </div>
        <div style="text-align: right;">
            <strong>$<?= number_format($item['subtotal'], 2) ?></strong>
        </div>
    </div>
    <?php endforeach; ?>
    
    <div class="cart-total">
        Total: $<?= number_format($total, 2) ?>
    </div>
    
    <div style="margin-top: 24px; display: flex; gap: 12px;">
        <?php if (is_logged_in()): ?>
            <form method="POST" style="flex: 1;">
                <button type="submit" name="checkout" class="btn" style="width: 100%;">Checkout</button>
            </form>
        <?php else: ?>
            <a href="?page=login" class="btn" style="flex: 1; text-align: center; background: #22d3ee;">Login to Checkout</a>
        <?php endif; ?>
        <form method="POST">
            <button type="submit" name="clear_cart" class="btn" style="background: #ef4444;">Clear Cart</button>
        </form>
    </div>
<?php endif; ?>