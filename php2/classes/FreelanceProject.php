<?php
/**
 * FreelanceProject - Extends Project
 * Demonstrates: Inheritance, Polymorphism
 */

class FreelanceProject extends Project
{
    private ?string $clientName = null;
    private ?float $budget = null;
    private ?string $deadline = null;
    private string $status = 'ongoing';
    
    public function __construct(
        string $title,
        string $description,
        ?string $clientName = null
    ) {
        parent::__construct($title, $description, 'freelance');
        $this->clientName = $clientName;
    }
    
    public function getProjectType(): string
    {
        return 'Freelance Project';
    }
    
    public function getTechStack(): array
    {
        return ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'];
    }
    
    public function getClientName(): ?string
    {
        return $this->clientName;
    }
    
    public function setClientName(?string $name): self
    {
        $this->clientName = $name;
        return $this;
    }
    
    public function getBudget(): ?float
    {
        return $this->budget;
    }
    
    public function setBudget(?float $budget): self
    {
        $this->budget = $budget;
        return $this;
    }
    
    public function getDeadline(): ?string
    {
        return $this->deadline;
    }
    
    public function setDeadline(?string $deadline): self
    {
        $this->deadline = $deadline;
        return $this;
    }
    
    public function getStatus(): string
    {
        return $this->status;
    }
    
    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }
    
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
    
    public function isOngoing(): bool
    {
        return $this->status === 'ongoing';
    }
    
    public function getFormattedBudget(): string
    {
        if ($this->budget === null) {
            return 'Negotiable';
        }
        return '$' . number_format($this->budget, 2);
    }
    
    public function save(): bool
    {
        $this->category = 'freelance';
        return parent::save();
    }
    
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'client_name' => $this->clientName,
            'budget' => $this->budget,
            'deadline' => $this->deadline,
            'status' => $this->status
        ]);
    }
}