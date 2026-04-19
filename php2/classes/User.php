<?php
/**
 * User - Base User Class
 * Demonstrates: Encapsulation, Getters/Setters, Type Hints
 */

class User
{
    private ?int $id = null;
    private string $name;
    private string $email;
    private string $passwordHash;
    private string $role = 'user';
    private ?string $avatarUrl = null;
    private ?string $createdAt = null;
    
    private ?UserProfile $profile = null;
    
    public function __construct(
        string $name,
        string $email,
        string $passwordHash = '',
        ?int $id = null
    ) {
        $this->name = $name;
        $this->email = $email;
        $this->passwordHash = $passwordHash;
        $this->id = $id;
    }
    
    public function getId(): ?int
    {
        return $this->id;
    }
    
    public function getName(): string
    {
        return $this->name;
    }
    
    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }
    
    public function getEmail(): string
    {
        return $this->email;
    }
    
    public function getRole(): string
    {
        return $this->role;
    }
    
    public function setRole(string $role): self
    {
        $this->role = $role;
        return $this;
    }
    
    public function getAvatarUrl(): ?string
    {
        return $this->avatarUrl;
    }
    
    public function setAvatarUrl(?string $url): self
    {
        $this->avatarUrl = $url;
        return $this;
    }
    
    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }
    
    public function getProfile(): ?UserProfile
    {
        return $this->profile;
    }
    
    public function setProfile(UserProfile $profile): self
    {
        $this->profile = $profile;
        return $this;
    }
    
    public function hasProfile(): bool
    {
        return $this->profile !== null;
    }
    
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
    
    public function isEmployee(): bool
    {
        return $this->role === 'employee';
    }
    
    public function verifyPassword(string $password): bool
    {
        return password_verify($password, $this->passwordHash);
    }
    
    public function setPassword(string $password): self
    {
        $this->passwordHash = password_hash($password, PASSWORD_DEFAULT);
        return $this;
    }
    
    public function save(): bool
    {
        $db = Database::getInstance();
        
        if ($this->id === null) {
            $id = $db->insert('users', [
                'name' => $this->name,
                'email' => $this->email,
                'password_hash' => $this->passwordHash,
                'role' => $this->role,
                'avatar_url' => $this->avatarUrl
            ]);
            $this->id = $id;
            return $id > 0;
        }
        
        $db->update(
            'users',
            [
                'name' => $this->name,
                'email' => $this->email,
                'role' => $this->role,
                'avatar_url' => $this->avatarUrl,
                'updated_at' => date('Y-m-d H:i:s')
            ],
            'id = ?',
            [$this->id]
        );
        
        return true;
    }
    
    public static function authenticate(string $email, string $password): ?User
    {
        $db = Database::getInstance();
        
        $userData = $db->selectOne(
            "SELECT * FROM users WHERE email = ?",
            [$email]
        );
        
        if (!$userData) {
            return null;
        }
        
        $user = new self(
            $userData['name'],
            $userData['email'],
            $userData['password_hash'],
            $userData['id']
        );
        $user->setRole($userData['role']);
        $user->setAvatarUrl($userData['avatar_url'] ?? null);
        
        if (!$user->verifyPassword($password)) {
            return null;
        }
        
        return $user;
    }
    
    public static function find(int $id): ?User
    {
        $db = Database::getInstance();
        
        $userData = $db->selectOne(
            "SELECT * FROM users WHERE id = ?",
            [$id]
        );
        
        if (!$userData) {
            return null;
        }
        
        $user = new self(
            $userData['name'],
            $userData['email'],
            $userData['password_hash'],
            $userData['id']
        );
        $user->setRole($userData['role']);
        $user->setAvatarUrl($userData['avatar_url'] ?? null);
        
        return $user;
    }
    
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'avatar_url' => $this->avatarUrl,
            'created_at' => $this->createdAt
        ];
    }
    
    public function __toString(): string
    {
        return $this->name;
    }
}