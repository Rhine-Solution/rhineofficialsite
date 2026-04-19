<?php
/**
 * UserProfile - 1:1 Relationship with User
 * Demonstrates: Composition
 */

class UserProfile
{
    private ?int $id = null;
    private int $userId;
    private ?string $bio = null;
    private ?string $location = null;
    private ?string $website = null;
    private ?string $github = null;
    private ?string $twitter = null;
    private ?string $linkedin = null;
    
    public function __construct(
        int $userId,
        ?string $bio = null,
        ?string $location = null
    ) {
        $this->userId = $userId;
        $this->bio = $bio;
        $this->location = $location;
    }
    
    public function getId(): ?int
    {
        return $this->id;
    }
    
    public function getUserId(): int
    {
        return $this->userId;
    }
    
    public function getBio(): ?string
    {
        return $this->bio;
    }
    
    public function setBio(?string $bio): self
    {
        $this->bio = $bio;
        return $this;
    }
    
    public function getLocation(): ?string
    {
        return $this->location;
    }
    
    public function setLocation(?string $location): self
    {
        $this->location = $location;
        return $this;
    }
    
    public function getWebsite(): ?string
    {
        return $this->website;
    }
    
    public function setWebsite(?string $website): self
    {
        $this->website = $website;
        return $this;
    }
    
    public function getGithub(): ?string
    {
        return $this->github;
    }
    
    public function setGithub(?string $github): self
    {
        $this->github = $github;
        return $this;
    }
    
    public function getTwitter(): ?string
    {
        return $this->twitter;
    }
    
    public function setTwitter(?string $twitter): self
    {
        $this->twitter = $twitter;
        return $this;
    }
    
    public function getLinkedin(): ?string
    {
        return $this->linkedin;
    }
    
    public function setLinkedin(?string $linkedin): self
    {
        $this->linkedin = $linkedin;
        return $this;
    }
    
    public function save(): bool
    {
        $db = Database::getInstance();
        
        if ($this->id === null) {
            $id = $db->insert('user_profiles', [
                'user_id' => $this->userId,
                'bio' => $this->bio,
                'location' => $this->location,
                'website' => $this->website,
                'github' => $this->github,
                'twitter' => $this->twitter,
                'linkedin' => $this->linkedin
            ]);
            $this->id = $id;
            return $id > 0;
        }
        
        $db->update(
            'user_profiles',
            [
                'bio' => $this->bio,
                'location' => $this->location,
                'website' => $this->website,
                'github' => $this->github,
                'twitter' => $this->twitter,
                'linkedin' => $this->linkedin
            ],
            'id = ?',
            [$this->id]
        );
        
        return true;
    }
    
    public static function findByUserId(int $userId): ?UserProfile
    {
        $db = Database::getInstance();
        
        $data = $db->selectOne(
            "SELECT * FROM user_profiles WHERE user_id = ?",
            [$userId]
        );
        
        if (!$data) {
            return null;
        }
        
        $profile = new self(
            $data['user_id'],
            $data['bio'],
            $data['location']
        );
        $profile->id = $data['id'];
        $profile->setWebsite($data['website']);
        $profile->setGithub($data['github']);
        $profile->setTwitter($data['twitter']);
        $profile->setLinkedin($data['linkedin']);
        
        return $profile;
    }
    
    public function toArray(): array
    {
        return [
            'bio' => $this->bio,
            'location' => $this->location,
            'website' => $this->website,
            'github' => $this->github,
            'twitter' => $this->twitter,
            'linkedin' => $this->linkedin
        ];
    }
}