<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rhine Portfolio - OOP PHP</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0f; color: #e4e4e7; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        nav { background: rgba(10,10,15,0.95); border-bottom: 1px solid #27272a; padding: 16px 0; position: sticky; top: 0; z-index: 100; }
        nav .container { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: 700; color: #6366f1; text-decoration: none; }
        .nav-links { display: flex; gap: 24px; list-style: none; }
        .nav-links a { color: #a1a1aa; text-decoration: none; transition: color 0.3s; }
        .nav-links a:hover { color: #fff; }
        
        main { padding: 40px 0; min-height: 80vh; }
        h1 { font-size: 2.5rem; margin-bottom: 16px; }
        h2 { font-size: 1.8rem; margin-bottom: 12px; }
        
        .btn { display: inline-block; padding: 12px 24px; background: #6366f1; color: #fff; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; }
        .btn:hover { background: #818cf8; }
        .btn-secondary { background: #27272a; }
        
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 24px; }
        .project-card { background: #12121a; border: 1px solid #27272a; border-radius: 12px; padding: 24px; transition: transform 0.3s, border-color 0.3s; }
        .project-card:hover { transform: translateY(-4px); border-color: #6366f1; }
        .project-type { font-size: 0.8rem; color: #22d3ee; text-transform: uppercase; margin-bottom: 8px; }
        .project-title { font-size: 1.3rem; margin-bottom: 8px; }
        .project-desc { color: #a1a1aa; font-size: 0.95rem; margin: 12px 0; }
        .project-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
        .project-tags span { padding: 4px 10px; font-size: 0.75rem; background: #1a1a24; border-radius: 20px; color: #a1a1aa; }
        
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px; background: #0a0a0f; border: 1px solid #27272a; border-radius: 8px; color: #fff; font-size: 1rem; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #6366f1; }
        
        .form-box { max-width: 400px; margin: 40px auto; background: #12121a; padding: 32px; border-radius: 12px; border: 1px solid #27272a; }
        
        .alert { padding: 16px; border-radius: 8px; margin-bottom: 20px; }
        .alert-error { background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #ef4444; }
        .alert-success { background: rgba(34,197,94,0.2); border: 1px solid #22c55e; color: #22c55e; }
        
        .hero { text-align: center; padding: 60px 0; }
        .hero h1 { font-size: 3rem; margin-bottom: 16px; }
        .hero p { color: #a1a1aa; font-size: 1.2rem; max-width: 600px; margin: 0 auto 24px; }
        
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin: 40px 0; }
        .feature { background: #12121a; padding: 24px; border-radius: 12px; border: 1px solid #27272a; }
        .feature h3 { margin-bottom: 8px; color: #22d3ee; }
        .feature p { color: #a1a1aa; font-size: 0.95rem; }
        
        footer { background: #12121a; border-top: 1px solid #27272a; padding: 24px 0; text-align: center; color: #a1a1aa; }
    </style>
</head>
<body>
    <nav>
        <div class="container">
            <a href="/" class="logo">Rhine Portfolio</a>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/projects">Projects</a></li>
                <?php if (isset($_SESSION['user_id'])): ?>
                    <li><a href="/admin">Admin</a></li>
                    <li><a href="/logout">Logout</a></li>
                <?php else: ?>
                    <li><a href="/login">Login</a></li>
                <?php endif; ?>
            </ul>
        </div>
    </nav>
    <main>
        <div class="container">