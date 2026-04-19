<?php
/**
 * Rhine PHP Webshop - Vercel API
 * API endpoint for products
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('SUPABASE_URL', 'https://crqjedivobupxbbathux.supabase.co');
define('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get products from Supabase
    $ch = curl_init(SUPABASE_URL . '/rest/v1/products?select=*&order=created_at.desc');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    
    $products = json_decode($response, true) ?: [];
    
    // If no products in DB, return demo products
    if (empty($products)) {
        $products = [
            ['id' => 1, 'name' => 'Premium Web Hosting', 'price' => 9.99, 'description' => 'High-performance hosting with SSD storage'],
            ['id' => 2, 'name' => 'Domain Registration', 'price' => 12.99, 'description' => 'Register your perfect domain name'],
            ['id' => 3, 'name' => 'SSL Certificate', 'price' => 49.99, 'description' => 'Secure your website with SSL'],
            ['id' => 4, 'name' => 'Professional Email', 'price' => 5.99, 'description' => 'Custom email for your business']
        ];
    }
    
    echo json_encode(['success' => true, 'products' => $products]);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Handle add to cart
    if (isset($input['action']) && $input['action'] === 'add_to_cart') {
        echo json_encode(['success' => true, 'message' => 'Added to cart']);
        exit;
    }
    
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Method not allowed']);