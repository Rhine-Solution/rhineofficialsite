<?php include __DIR__ . '/header.php'; ?>

<?php if (!$project): ?>
    <div class="alert alert-error">Project not found</div>
    <a href="/projects" class="btn">Back to Projects</a>
<?php else: ?>
    <a href="/projects" style="color: #a1a1aa;">&larr; Back to Projects</a>
    
    <h1><?= htmlspecialchars($project->getTitle()) ?></h1>
    <p style="color: #22d3ee; font-size: 0.9rem; margin-bottom: 16px;"><?= htmlspecialchars($project->getProjectType()) ?></p>
    
    <div style="background: #12121a; border: 1px solid #27272a; border-radius: 12px; padding: 32px; margin-top: 24px;">
        <p style="font-size: 1.1rem; margin-bottom: 24px;"><?= htmlspecialchars($project->getDescription()) ?></p>
        
        <h3 style="margin-bottom: 12px;">Tech Stack</h3>
        <div class="project-tags">
            <?php foreach ($project->getTechStack() as $tech): ?>
            <span><?= htmlspecialchars($tech) ?></span>
            <?php endforeach; ?>
        </div>
        
        <?php if ($project->getDemoUrl() || $project->getGithubUrl()): ?>
        <div style="margin-top: 24px; display: flex; gap: 12px;">
            <?php if ($project->getDemoUrl()): ?>
            <a href="<?= htmlspecialchars($project->getDemoUrl()) ?>" class="btn">Live Demo</a>
            <?php endif; ?>
            <?php if ($project->getGithubUrl()): ?>
            <a href="<?= htmlspecialchars($project->getGithubUrl()) ?>" class="btn btn-secondary">GitHub</a>
            <?php endif; ?>
        </div>
        <?php endif; ?>
    </div>
<?php endif; ?>

<?php include __DIR__ . '/footer.php';