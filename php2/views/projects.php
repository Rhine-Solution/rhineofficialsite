<?php include __DIR__ . '/header.php'; ?>

<h1>My Projects</h1>
<p style="color: #a1a1aa; margin-bottom: 32px;">A collection of projects demonstrating various technologies and skills.</p>

<div class="projects-grid">
    <?php 
    // Demo projects for display (would come from database)
    $demoProjects = [
        ['title' => 'E-Commerce Platform', 'description' => 'Full-featured online shop with cart, checkout, and admin panel.', 'category' => 'freelance', 'type' => 'Freelance Project', 'tech' => ['PHP', 'MySQL', 'JavaScript']],
        ['title' => 'School Management System', 'description' => 'Student and course management for educational institutions.', 'category' => 'school', 'type' => 'School Project', 'tech' => ['PHP', 'Laravel', 'PostgreSQL']],
        ['title' => 'Personal Portfolio', 'description' => 'Responsive portfolio website with contact form.', 'category' => 'personal', 'type' => 'Personal Project', 'tech' => ['HTML', 'CSS', 'JavaScript']],
        ['title' => 'Task Management App', 'description' => 'Collaborative task management with real-time updates.', 'category' => 'freelance', 'type' => 'Freelance Project', 'tech' => ['React', 'Node.js', 'MongoDB']],
    ];
    
    foreach ($demoProjects as $project): 
    ?>
    <div class="project-card">
        <div class="project-type"><?= htmlspecialchars($project['type']) ?></div>
        <h3 class="project-title"><?= htmlspecialchars($project['title']) ?></h3>
        <p class="project-desc"><?= htmlspecialchars($project['description']) ?></p>
        <div class="project-tags">
            <?php foreach ($project['tech'] as $tech): ?>
            <span><?= htmlspecialchars($tech) ?></span>
            <?php endforeach; ?>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<?php include __DIR__ . '/footer.php';