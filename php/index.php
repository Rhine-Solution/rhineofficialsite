<?php
/**
 * Rhine PHP Webshop - Basic Version
 * Demonstrates: PHP fundamentals, forms, sessions, Supabase connection
 */

// Database configuration - Using Supabase PostgreSQL
define('DB_HOST', 'db.crqjedivobupxbbathux.supabase.co');
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');
define('DB_USER', 'postgres');
define('DB_PASS', 'YOUR_SUPABASE_PASSWORD_HERE'); // Replace with your actual Supabase password

define('SUPABASE_URL', 'https://crqjedivobupxbbathux.supabase.co');
define('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM');

session_start();

function get_db_connection() {
    try {
        $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        return null;
    }
}

function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function redirect($path) {
    header("Location: $path");
    exit;
}

// Get current page
$page = $_GET['page'] ?? 'home';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rhine Shop - <?= ucfirst($page) ?></title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0f; color: #e4e4e7; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Navigation */
        nav { background: rgba(10,10,15,0.95); border-bottom: 1px solid #27272a; padding: 16px 0; position: sticky; top: 0; z-index: 100; }
        nav .container { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: 700; color: #6366f1; text-decoration: none; }
        .nav-links { display: flex; gap: 24px; list-style: none; }
        .nav-links a { color: #a1a1aa; text-decoration: none; transition: color 0.3s; }
        .nav-links a:hover, .nav-links a.active { color: #fff; }
        
        /* Main Content */
        main { padding: 40px 0; min-height: 80vh; }
        
        /* Products Grid */
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 24px; }
        .product-card { background: #12121a; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; transition: transform 0.3s, border-color 0.3s; }
        .product-card:hover { transform: translateY(-4px); border-color: #6366f1; }
        .product-image { height: 200px; background: #1a1a24; display: flex; align-items: center; justify-content: center; font-size: 4rem; }
        .product-info { padding: 20px; }
        .product-title { font-size: 1.2rem; margin-bottom: 8px; }
        .product-price { color: #22d3ee; font-size: 1.3rem; font-weight: 600; margin-bottom: 12px; }
        .product-desc { color: #a1a1aa; font-size: 0.9rem; margin-bottom: 16px; }
        .btn { display: inline-block; padding: 12px 24px; background: #6366f1; color: #fff; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; transition: background 0.3s; }
        .btn:hover { background: #818cf8; }
        
        /* Forms */
        .form-box { max-width: 400px; margin: 40px auto; background: #12121a; padding: 32px; border-radius: 12px; border: 1px solid #27272a; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px; background: #0a0a0f; border: 1px solid #27272a; border-radius: 8px; color: #fff; font-size: 1rem; }
        .form-group input:focus { outline: none; border-color: #6366f1; }
        
        /* Cart */
        .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #12121a; border-radius: 8px; margin-bottom: 12px; }
        .cart-total { font-size: 1.5rem; font-weight: 600; text-align: right; margin-top: 24px; }
        
        /* Footer */
        footer { background: #12121a; border-top: 1px solid #27272a; padding: 24px 0; text-align: center; color: #a1a1aa; }
        
        /* Alerts */
        .alert { padding: 16px; border-radius: 8px; margin-bottom: 20px; }
        .alert-success { background: rgba(34,197,94,0.2); border: 1px solid #22c55e; color: #22c55e; }
        .alert-error { background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #ef4444; }
    </style>
</head>
<body>
    <nav>
        <div class="container">
            <a href="?page=home" class="logo">Rhine Shop</a>
            <ul class="nav-links">
                <li><a href="?page=home" <?= $page=='home'?'class="active"':'' ?>>Home</a></li>
                <li><a href="?page=products" <?= $page=='products'?'class="active"':'' ?>>Products</a></li>
                <?php if(is_logged_in()): ?>
                    <li><a href="?page=orders" <?= $page=='orders'?'class="active"':'' ?>>Orders</a></li>
                    <li><a href="?page=logout">Logout (<?= sanitize($_SESSION['user_name'] ?? 'User') ?>)</a></li>
                <?php else: ?>
                    <li><a href="?page=login" <?= $page=='login'?'class="active"':'' ?>>Login</a></li>
                    <li><a href="?page=register" <?= $page=='register'?'class="active"':'' ?>>Register</a></li>
                <?php endif; ?>
                <li><a href="?page=cart" <?= $page=='cart'?'class="active"':'' ?>>Cart</a></li>
            </ul>
        </div>
    </nav>
    
    <main>
        <div class="container">
            <?php
            // Simple routing
            switch($page) {
                case 'home':
                    include 'pages/home.php';
                    break;
                case 'products':
                    include 'pages/products.php';
                    break;
                case 'login':
                    include 'pages/login.php';
                    break;
                case 'register':
                    include 'pages/register.php';
                    break;
                case 'cart':
                    include 'pages/cart.php';
                    break;
                case 'orders':
                    include 'pages/orders.php';
                    break;
                case 'logout':
                    session_destroy();
                    redirect('?page=home');
                    break;
                default:
                    echo "<h1>Page not found</h1>";
            }
            ?>
        </div>
    </main>
    
    <footer>
        <div class="container">
            <p>&copy; 2026 Rhine Shop. Built with PHP.</p>
        </div>
    </footer>
</body>
</html>