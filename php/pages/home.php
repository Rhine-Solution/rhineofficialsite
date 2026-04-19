<?php
// Home Page with featured products from Supabase

$featured_products = [];
$url = SUPABASE_URL . '/rest/v1/products?select=*&limit=4&order=created_at.desc';

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
    $featured_products = $data;
}
?>
<section class="hero" style="text-align: center; padding: 60px 0;">
    <h1 style="font-size: 3rem; margin-bottom: 16px;">Welcome to Rhine Shop</h1>
    <p style="color: #a1a1aa; font-size: 1.2rem; margin-bottom: 32px;">
        Your one-stop shop for quality products. Built with PHP & Supabase.
    </p>
    <div style="display: flex; gap: 16px; justify-content: center;">
        <a href="?page=products" class="btn">Browse Products</a>
        <a href="?page=register" class="btn" style="background: #22d3ee;">Create Account</a>
    </div>
</section>

<?php if (!empty($featured_products)): ?>
<section style="padding: 40px 0;">
    <h2 style="text-align: center; margin-bottom: 32px;">Featured Products</h2>
    <div class="products-grid">
        <?php foreach ($featured_products as $product): ?>
        <div class="product-card">
            <?php if (!empty($product['image_url'])): ?>
            <div class="product-image" style="background-size: cover; background-position: center;">
                <img src="<?= sanitize($product['image_url']) ?>" alt="<?= sanitize($product['name']) ?>" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
            </div>
            <?php else: ?>
            <div class="product-image">📦</div>
            <?php endif; ?>
            <div class="product-info">
                <h3 class="product-title"><?= sanitize($product['name'] ?? 'Product') ?></h3>
                <p class="product-desc"><?= sanitize($product['description'] ?? '') ?></p>
                <div class="product-price">$<?= number_format($product['price'] ?? 0, 2) ?></div>
                <a href="?page=products" class="btn" style="width: 100%; text-align: center;">View Details</a>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>
<?php endif; ?>

<section style="padding: 40px 0;">
    <h2 style="text-align: center; margin-bottom: 32px;">Why Choose Us</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
        <div style="background: #12121a; padding: 24px; border-radius: 12px; border: 1px solid #27272a;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🚀</div>
            <h3 style="margin-bottom: 8px;">Fast Delivery</h3>
            <p style="color: #a1a1aa;">Quick and reliable shipping to your doorstep.</p>
        </div>
        <div style="background: #12121a; padding: 24px; border-radius: 12px; border: 1px solid #27272a;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🔒</div>
            <h3 style="margin-bottom: 8px;">Secure Payments</h3>
            <p style="color: #a1a1aa;">Your payments are safe and secure with us.</p>
        </div>
        <div style="background: #12121a; padding: 24px; border-radius: 12px; border: 1px solid #27272a;">
            <div style="font-size: 2rem; margin-bottom: 12px;">💎</div>
            <h3 style="margin-bottom: 8px;">Quality Products</h3>
            <p style="color: #a1a1aa;">Only the best products make it to our store.</p>
        </div>
    </div>
</section>