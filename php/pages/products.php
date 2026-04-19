<?php
// Products Page
$products = [
    ['id' => 1, 'name' => 'Developer Keyboard', 'price' => 149.99, 'description' => 'Mechanical keyboard with RGB lighting', 'emoji' => '⌨️'],
    ['id' => 2, 'name' => 'Wireless Mouse', 'price' => 79.99, 'description' => 'Ergonomic wireless mouse', 'emoji' => '🖱️'],
    ['id' => 3, 'name' => 'HD Monitor', 'price' => 299.99, 'description' => '27-inch 4K display', 'emoji' => '🖥️'],
    ['id' => 4, 'name' => 'USB-C Hub', 'price' => 49.99, 'description' => 'Multi-port USB-C hub', 'emoji' => '🔌'],
    ['id' => 5, 'name' => 'Webcam HD', 'price' => 89.99, 'description' => '1080p webcam with mic', 'emoji' => '📷'],
    ['id' => 6, 'name' => 'Desk Lamp', 'price' => 39.99, 'description' => 'LED desk lamp with dimmer', 'emoji' => '💡'],
];

// Add to cart handling
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_to_cart'])) {
    $product_id = (int)$_POST['product_id'];
    $quantity = (int)$_POST['quantity'];
    
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
    <div class="product-card">
        <div class="product-image"><?= $product['emoji'] ?></div>
        <div class="product-info">
            <h3 class="product-title"><?= sanitize($product['name']) ?></h3>
            <p class="product-desc"><?= sanitize($product['description']) ?></p>
            <div class="product-price">$<?= number_format($product['price'], 2) ?></div>
            <form method="POST">
                <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
                <input type="hidden" name="quantity" value="1">
                <button type="submit" name="add_to_cart" class="btn" style="width: 100%;">Add to Cart</button>
            </form>
        </div>
    </div>
    <?php endforeach; ?>
</div>