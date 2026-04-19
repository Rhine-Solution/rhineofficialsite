<?php include __DIR__ . '/header.php'; ?>

<h1>Admin Dashboard</h1>
<p style="color: #a1a1aa; margin-bottom: 32px;">Welcome, <?= htmlspecialchars($_SESSION['user_name']) ?>!</p>

<section style="margin-bottom: 48px;">
    <h2>Create New Project</h2>
    <form method="POST" action="/admin/project/create" style="background: #12121a; padding: 24px; border-radius: 12px; border: 1px solid #27272a;">
        <div class="form-group">
            <label for="title">Project Title</label>
            <input type="text" id="title" name="title" required>
        </div>
        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" rows="4" required></textarea>
        </div>
        <div class="form-group">
            <label for="category">Category</label>
            <select id="category" name="category" style="width: 100%; padding: 12px; background: #0a0a0f; border: 1px solid #27272a; border-radius: 8px; color: #fff;">
                <option value="freelance">Freelance</option>
                <option value="school">School</option>
                <option value="personal">Personal</option>
            </select>
        </div>
        <button type="submit" class="btn">Create Project</button>
    </form>
</section>

<section>
    <h2>Manage Projects</h2>
    <div class="projects-grid">
        <?php foreach ($projects as $project): ?>
        <div class="project-card">
            <h3 class="project-title"><?= htmlspecialchars($project->getTitle()) ?></h3>
            <p class="project-desc"><?= htmlspecialchars($project->getDescription()) ?></p>
            <div style="display: flex; gap: 12px; margin-top: 16px;">
                <form method="POST" action="/admin/project/delete" style="display: inline;">
                    <input type="hidden" name="id" value="<?= $project->getId() ?>">
                    <button type="submit" class="btn" style="background: #ef4444; padding: 8px 16px; font-size: 0.9rem;">Delete</button>
                </form>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>

<?php include __DIR__ . '/footer.php';