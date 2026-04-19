<?php
/**
 * Project - Abstract Base Class
 * Demonstrates: Abstract Classes, Inheritance, Polymorphism
 */

abstract class Project
{
    protected ?int $id = null;
    protected string $title;
    protected string $description;
    protected ?string $category = null;
    protected ?string $imageUrl = null;
    protected ?string $demoUrl = null;
    protected ?string $githubUrl = null;
    protected bool $featured = false;
    protected ?int $userId = null;
    protected ?string $createdAt = null;
    protected ?string $updatedAt = null;
    
    public function __construct(
        string $title,
        string $description,
        ?string $category = null
    ) {
        $this->title = $title;
        $this->description = $description;
        $this->category = $category;
    }
    
    abstract public function getProjectType(): string;
    
    abstract public function getTechStack(): array;
    
    public function getId(): ?int
    {
        return $this->id;
    }
    
    public function getTitle(): string
    {
        return $this->title;
    }
    
    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }
    
    public function getDescription(): string
    {
        return $this->description;
    }
    
    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }
    
    public function getCategory(): ?string
    {
        return $this->category;
    }
    
    public function setCategory(?string $category): self
    {
        $this->category = $category;
        return $this;
    }
    
    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }
    
    public function setImageUrl(?string $url): self
    {
        $this->imageUrl = $url;
        return $this;
    }
    
    public function getDemoUrl(): ?string
    {
        return $this->demoUrl;
    }
    
    public function setDemoUrl(?string $url): self
    {
        $this->demoUrl = $url;
        return $this;
    }
    
    public function getGithubUrl(): ?string
    {
        return $this->githubUrl;
    }
    
    public function setGithubUrl(?string $url): self
    {
        $this->githubUrl = $url;
        return $this;
    }
    
    public function isFeatured(): bool
    {
        return $this->featured;
    }
    
    public function setFeatured(bool $featured): self
    {
        $this->featured = $featured;
        return $this;
    }
    
    public function getUserId(): ?int
    {
        return $this->userId;
    }
    
    public function setUserId(?int $userId): self
    {
        $this->userId = $userId;
        return $this;
    }
    
    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }
    
    public function getUpdatedAt(): ?string
    {
        return $this->updatedAt;
    }
    
    public function save(): bool
    {
        $db = Database::getInstance();
        
        $data = [
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'image_url' => $this->imageUrl,
            'demo_url' => $this->demoUrl,
            'github_url' => $this->githubUrl,
            'featured' => $this->featured ? 'true' : 'false',
            'user_id' => $this->userId
        ];
        
        if ($this->id === null) {
            $id = $db->insert('projects', $data);
            $this->id = $id;
            return $id > 0;
        }
        
        $data['updated_at'] = date('Y-m-d H:i:s');
        
        $db->update('projects', $data, 'id = ?', [$this->id]);
        return true;
    }
    
    public static function find(int $id): ?self
    {
        $db = Database::getInstance();
        
        $data = $db->selectOne(
            "SELECT * FROM projects WHERE id = ?",
            [$id]
        );
        
        if (!$data) {
            return null;
        }
        
        return self::createFromData($data);
    }
    
    public static function all(): array
    {
        $db = Database::getInstance();
        
        $rows = $db->select("SELECT * FROM projects ORDER BY created_at DESC");
        
        return array_map(fn($row) => self::createFromData($row), $rows);
    }
    
    public static function findFeatured(): array
    {
        $db = Database::getInstance();
        
        $rows = $db->select("SELECT * FROM projects WHERE featured = true ORDER BY created_at DESC");
        
        return array_map(fn($row) => self::createFromData($row), $rows);
    }
    
    public static function delete(int $id): bool
    {
        $db = Database::getInstance();
        return $db->delete('projects', 'id = ?', [$id]) > 0;
    }
    
    public static function create(array $data): self
    {
        $project = new static(
            $data['title'] ?? '',
            $data['description'] ?? '',
            $data['category'] ?? null
        );
        
        if (isset($data['id'])) {
            $project->id = $data['id'];
        }
        if (isset($data['user_id'])) {
            $project->userId = $data['user_id'];
        }
        if (isset($data['image_url'])) {
            $project->imageUrl = $data['image_url'];
        }
        if (isset($data['demo_url'])) {
            $project->demoUrl = $data['demo_url'];
        }
        if (isset($data['github_url'])) {
            $project->githubUrl = $data['github_url'];
        }
        if (isset($data['featured'])) {
            $project->featured = $data['featured'] === 't' || $data['featured'] === true;
        }
        
        return $project;
    }
    
    protected static function createFromData(array $data): self
    {
        $className = static::class;
        $project = new $className(
            $data['title'],
            $data['description'],
            $data['category'] ?? null
        );
        
        $project->id = $data['id'];
        $project->userId = $data['user_id'] ?? null;
        $project->imageUrl = $data['image_url'] ?? null;
        $project->demoUrl = $data['demo_url'] ?? null;
        $project->githubUrl = $data['github_url'] ?? null;
        $project->featured = $data['featured'] === 't' || $data['featured'] === true;
        $project->createdAt = $data['created_at'] ?? null;
        $project->updatedAt = $data['updated_at'] ?? null;
        
        return $project;
    }
    
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'project_type' => $this->getProjectType(),
            'tech_stack' => $this->getTechStack(),
            'image_url' => $this->imageUrl,
            'demo_url' => $this->demoUrl,
            'github_url' => $this->githubUrl,
            'featured' => $this->featured,
            'created_at' => $this->createdAt
        ];
    }
}