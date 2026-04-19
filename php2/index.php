<?php
/**
 * Rhine PHP Portfolio - OOP Version
 * Demonstrates: Classes, Inheritance, Encapsulation, Interfaces, Traits
 */

require_once __DIR__ . '/classes/Autoloader.php';
require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/User.php';
require_once __DIR__ . '/classes/Admin.php';
require_once __DIR__ . '/classes/Project.php';
require_once __DIR__ . '/classes/FreelanceProject.php';
require_once __DIR__ . '/classes/SchoolProject.php';
require_once __DIR__ . '/classes/Router.php';

session_start();

$router = new Router();

$router->get('/', function() {
    include __DIR__ . '/views/home.php';
});

$router->get('/projects', function() {
    $projects = Project::all();
    include __DIR__ . '/views/projects.php';
});

$router->get('/project/{id}', function($id) {
    $project = Project::find($id);
    include __DIR__ . '/views/project-detail.php';
});

$router->get('/login', function() {
    include __DIR__ . '/views/login.php';
});

$router->post('/login', function() {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    $user = User::authenticate($email, $password);
    
    if ($user) {
        $_SESSION['user_id'] = $user->getId();
        $_SESSION['user_name'] = $user->getName();
        $_SESSION['user_role'] = $user->getRole();
        header('Location: /admin');
        exit;
    }
    
    $_SESSION['error'] = 'Invalid credentials';
    header('Location: /login');
    exit;
});

$router->get('/logout', function() {
    session_destroy();
    header('Location: /');
    exit;
});

$router->get('/admin', function() {
    if (!isset($_SESSION['user_id'])) {
        header('Location: /login');
        exit;
    }
    
    $projects = Project::all();
    include __DIR__ . '/views/admin.php';
});

$router->post('/admin/project/create', function() {
    if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
        http_response_code(403);
        exit;
    }
    
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $category = $_POST['category'] ?? 'freelance';
    
    $project = Project::create([
        'title' => $title,
        'description' => $description,
        'category' => $category,
        'user_id' => $_SESSION['user_id']
    ]);
    
    header('Location: /admin');
    exit;
});

$router->post('/admin/project/delete', function() {
    if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
        http_response_code(403);
        exit;
    }
    
    $id = $_POST['id'] ?? 0;
    Project::delete($id);
    
    header('Location: /admin');
    exit;
});

$router->dispatch();