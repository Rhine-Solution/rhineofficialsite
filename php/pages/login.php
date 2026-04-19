<?php
// Login Page
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        $error = 'Please fill in all fields';
    } else {
        // Demo login - in production, verify against database
        if ($email === 'demo@rhine.dev' && $password === 'demo123') {
            $_SESSION['user_id'] = '1';
            $_SESSION['user_email'] = $email;
            $_SESSION['user_name'] = 'Demo User';
            redirect('?page=home');
        } else {
            $error = 'Invalid email or password';
        }
    }
}
?>
<h1 style="text-align: center; margin-bottom: 32px;">Login</h1>

<div class="form-box">
    <?php if ($error): ?>
        <div class="alert alert-error"><?= sanitize($error) ?></div>
    <?php endif; ?>
    
    <form method="POST">
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required value="<?= sanitize($_POST['email'] ?? '') ?>">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit" class="btn" style="width: 100%;">Login</button>
    </form>
    
    <p style="margin-top: 20px; text-align: center; color: #a1a1aa;">
        Demo: demo@rhine.dev / demo123
    </p>
</div>