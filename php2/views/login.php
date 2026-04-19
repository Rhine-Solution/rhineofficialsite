<?php include __DIR__ . '/header.php'; ?>

<h1 style="text-align: center; margin-bottom: 32px;">Admin Login</h1>

<div class="form-box">
    <?php if (isset($_SESSION['error'])): ?>
        <div class="alert alert-error"><?= htmlspecialchars($_SESSION['error']) ?></div>
        <?php unset($_SESSION['error']); ?>
    <?php endif; ?>
    
    <form method="POST" action="/login">
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit" class="btn" style="width: 100%;">Login</button>
    </form>
    
    <p style="margin-top: 20px; text-align: center; color: #a1a1aa; font-size: 0.9rem;">
        Demo: admin@rhine.dev / admin123
    </p>
</div>

<?php include __DIR__ . '/footer.php';