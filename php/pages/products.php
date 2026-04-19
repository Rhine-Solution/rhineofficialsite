<?php
// Products Page - Fetch from Supabase

function fetchProductsFromSupabase() {
    $url = SUPABASE_URL . '/rest/v1/products?select=*&order=created_at.desc';
    
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
    return is_array($data) ? $data : [];
}

$products = fetchProductsFromSupabase();

// Fallback to local products if Supabase fails
if (empty($products)) {
    $products = [
        ['id' => 1, 'name' => 'Developer Keyboard', 'price' => 149.99, 'description' => 'Mechanical keyboard with RGB lighting', 'emoji' => '⌨️'],
        ['id' => 2, 'name' => 'Wireless Mouse', 'price' => 79.99, 'description' => 'Ergonomic wireless mouse', 'emoji' => '🖱️'],
        ['id' => 3, 'name' => 'HD Monitor', 'price' => 299.99, 'description' => '27-inch 4K display', 'emoji' => '🖥️'],
        ['id' => 4, 'name' => 'USB-C Hub', 'price' => 49.99, 'description' => 'Multi-port USB-C hub', 'emoji' => '🔌'],
        ['id' => 5, 'name' => 'Webcam HD', 'price' => 89.99, 'description' => '1080p webcam with mic', 'emoji' => '📷'],
        ['id' => 6, 'name' => 'Desk Lamp', 'price' => 39.99, 'description' => 'LED desk lamp with dimmer', 'emoji' => '💡'],
    ];
}

// Add to cart handling
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_to_cart'])) {
    $product_id = sanitize($_POST['product_id']);
    $quantity = (int)($_POST['quantity'] ?? 1);
    
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }
    
    if (isset($_SESSION['cart'][$product_id])) {
        $_SESSION['cart'][$product_id] += $quantity;
    } else {
        $_SESSION['cart'][$product_id] = $quantity;
    }
    
    echo '<div class="alert alert-success">Product added to cart!</div>';
}
?>
<h1 style="margin-bottom: 24px;">Our Products</h1>

<div class="products-grid">
    <?php foreach ($products as $product): ?>
    <?php 
        $image = $product['image_url'] ?? $product['emoji'] ?? '📦';
        $name = sanitize($product['name'] ?? 'Product');
        $desc = sanitize($product['description'] ?? '');
        $price = $product['price'] ?? 0;
        $id = $product['id'] ?? 1;
    ?>
    <div class="product-card">
        <?php if (isset($product['image_url'])): ?>
        <div class="product-image" style="background-size: cover; background-position: center;">
            <img src="<?= $image ?>" alt="<?= $name ?>" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
        </div>
        <?php else: ?>
        <div class="product-image"><?= $image ?></div>
        <?php endif; ?>
        <div class="product-info">
            <h3 class="product-title"><?= $name ?></h3>
            <p class="product-desc"><?= $desc ?></p>
            <div class="product-price">$<?= number_format($price, 2) ?></div>
            <form method="POST">
                <input type="hidden" name="product_id" value="<?= $id ?>">
                <input type="hidden" name="quantity" value="1">
                <button type="submit" name="add_to_cart" class="btn" style="width: 100%;">Add to Cart</button>
            </form>
        </div>
    </div>
    <?php endforeach; ?>
</div>