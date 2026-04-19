<?php include __DIR__ . '/header.php'; ?>

<section class="hero">
    <h1>Welcome to My Portfolio</h1>
    <p>Full-Stack Developer specializing in PHP, Laravel, React, and modern web technologies. Building amazing digital experiences.</p>
    <div style="display: flex; gap: 16px; justify-content: center;">
        <a href="/projects" class="btn">View Projects</a>
        <a href="/login" class="btn btn-secondary">Admin Login</a>
    </div>
</section>

<section>
    <h2 style="text-align: center; margin-bottom: 24px;">Skills Demonstrated</h2>
    <div class="features">
        <div class="feature">
            <h3>Object-Oriented PHP</h3>
            <p>Classes, inheritance, encapsulation, interfaces, and traits for clean, maintainable code.</p>
        </div>
        <div class="feature">
            <h3>Design Patterns</h3>
            <p>Singleton for database, Factory for projects, Router for clean URLs.</p>
        </div>
        <div class="feature">
            <h3>Clean Architecture</h3>
            <p>Separation of concerns: Models, Views, Controllers, and Services.</p>
        </div>
        <div class="feature">
            <h3>Security Best Practices</h3>
            <p>Password hashing, SQL injection prevention, XSS protection.</p>
        </div>
    </div>
</section>

<section style="text-align: center;">
    <h2>Featured Projects</h2>
    <p style="color: #a1a1aa; margin-bottom: 24px;">Check out my work in the projects section.</p>
    <a href="/projects" class="btn">Browse All Projects</a>
</section>

<?php include __DIR__ . '/footer.php';