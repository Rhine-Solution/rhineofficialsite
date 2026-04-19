<?php
/**
 * Admin - Extends User
 * Demonstrates: Inheritance, Polymorphism
 */

class Admin extends User
{
    private string $adminLevel = 'standard';
    private ?string $permissions = null;
    
    public function __construct(
        string $name,
        string $email,
        string $passwordHash = '',
        ?int $id = null
    ) {
        parent::__construct($name, $email, $passwordHash, $id);
        $this->setRole('admin');
    }
    
    public function getAdminLevel(): string
    {
        return $this->adminLevel;
    }
    
    public function setAdminLevel(string $level): self
    {
        $this->adminLevel = $level;
        return $this;
    }
    
    public function getPermissions(): ?string
    {
        return $this->permissions;
    }
    
    public function setPermissions(?string $permissions): self
    {
        $this->permissions = $permissions;
        return $this;
    }
    
    public function isSuperAdmin(): bool
    {
        return $this->adminLevel === 'super';
    }
    
    public function canManageUsers(): bool
    {
        return in_array($this->adminLevel, ['super', 'standard']);
    }
    
    public function canManageProjects(): bool
    {
        return true;
    }
    
    public function canManageSettings(): bool
    {
        return $this->adminLevel === 'super';
    }
    
    public function getDashboardUrl(): string
    {
        return '/admin/dashboard';
    }
    
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'admin_level' => $this->adminLevel,
            'permissions' => $this->permissions
        ]);
    }
    
    public function __toString(): string
    {
        return parent::__toString() . " (Admin)";
    }
    
    public static function createSuperAdmin(
        string $name,
        string $email,
        string $password
    ): self {
        $admin = new self($name, $email);
        $admin->setPassword($password);
        $admin->setAdminLevel('super');
        $admin->save();
        
        return $admin;
    }
}