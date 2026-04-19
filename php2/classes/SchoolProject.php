<?php
/**
 * SchoolProject - Extends Project
 * Demonstrates: Inheritance, Polymorphism
 */

class SchoolProject extends Project
{
    private ?string $institution = null;
    private ?string $course = null;
    private ?int $semester = null;
    private ?string $academicYear = null;
    private bool $graded = false;
    private ?float $grade = null;
    
    public function __construct(
        string $title,
        string $description,
        ?string $institution = null
    ) {
        parent::__construct($title, $description, 'school');
        $this->institution = $institution;
    }
    
    public function getProjectType(): string
    {
        return 'School Project';
    }
    
    public function getTechStack(): array
    {
        return ['Python', 'Java', 'C++', 'SQL'];
    }
    
    public function getInstitution(): ?string
    {
        return $this->institution;
    }
    
    public function setInstitution(?string $institution): self
    {
        $this->institution = $institution;
        return $this;
    }
    
    public function getCourse(): ?string
    {
        return $this->course;
    }
    
    public function setCourse(?string $course): self
    {
        $this->course = $course;
        return $this;
    }
    
    public function getSemester(): ?int
    {
        return $this->semester;
    }
    
    public function setSemester(?int $semester): self
    {
        $this->semester = $semester;
        return $this;
    }
    
    public function getAcademicYear(): ?string
    {
        return $this->academicYear;
    }
    
    public function setAcademicYear(?string $year): self
    {
        $this->academicYear = $year;
        return $this;
    }
    
    public function isGraded(): bool
    {
        return $this->graded;
    }
    
    public function setGraded(bool $graded): self
    {
        $this->graded = $graded;
        return $this;
    }
    
    public function getGrade(): ?float
    {
        return $this->grade;
    }
    
    public function setGrade(?float $grade): self
    {
        $this->grade = $grade;
        $this->graded = $grade !== null;
        return $this;
    }
    
    public function getGradeLetter(): string
    {
        if ($this->grade === null) {
            return 'N/A';
        }
        
        return match(true) {
            $this->grade >= 90 => 'A+',
            $this->grade >= 85 => 'A',
            $this->grade >= 80 => 'A-',
            $this->grade >= 75 => 'B+',
            $this->grade >= 70 => 'B',
            $this->grade >= 65 => 'B-',
            $this->grade >= 60 => 'C+',
            $this->grade >= 55 => 'C',
            $this->grade >= 50 => 'C-',
            default => 'F'
        };
    }
    
    public function save(): bool
    {
        $this->category = 'school';
        return parent::save();
    }
    
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'institution' => $this->institution,
            'course' => $this->course,
            'semester' => $this->semester,
            'academic_year' => $this->academicYear,
            'graded' => $this->graded,
            'grade' => $this->grade,
            'grade_letter' => $this->getGradeLetter()
        ]);
    }
}