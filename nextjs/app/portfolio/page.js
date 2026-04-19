'use client'

import { useState, useEffect } from 'react'
import Card, { CardImage, CardContent, CardTitle, CardDescription } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const projects = [
  {
    id: 1,
    title: 'Python Chatbot',
    description: 'Interactive CLI chatbot demonstrating Python fundamentals with menus, loops, and functions.',
    tech: ['Python', 'CLI', 'OOP'],
    icon: '🐍',
    category: 'python',
    github: '#',
    demo: null
  },
  {
    id: 2,
    title: 'Book Manager',
    description: 'Book management system with JSON storage, search, and statistics features.',
    tech: ['Python', 'JSON', 'File I/O'],
    icon: '📚',
    category: 'python',
    github: '#',
    demo: null
  },
  {
    id: 3,
    title: 'PHP Webshop',
    description: 'E-commerce platform with user authentication, shopping cart, and admin panel.',
    tech: ['PHP', 'MySQL', 'Supabase'],
    icon: '🛒',
    category: 'php',
    github: '#',
    demo: null
  },
  {
    id: 4,
    title: 'OOP Portfolio',
    description: 'Object-oriented portfolio with classes, inheritance, and design patterns.',
    tech: ['PHP', 'OOP', 'MVC'],
    icon: '💼',
    category: 'php',
    github: '#',
    demo: null
  },
  {
    id: 5,
    title: 'Laravel Job Board',
    description: 'Full-stack job board with authentication, admin dashboard, and job management.',
    tech: ['Laravel', 'PHP', 'MySQL'],
    icon: '💼',
    category: 'laravel',
    github: '#',
    demo: 'https://rhine-laravel.pages.dev'
  },
  {
    id: 6,
    title: 'Portfolio Website',
    description: 'Personal portfolio showcasing projects with responsive design and modern styling.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    icon: '🎨',
    category: 'frontend',
    github: '#',
    demo: 'https://rhinesolution.com'
  },
  {
    id: 7,
    title: 'Sunny Travels',
    description: 'Travel booking application with React, filtering, and booking functionality.',
    tech: ['React', 'Next.js', 'Supabase'],
    icon: '✈️',
    category: 'react',
    github: '#',
    demo: null
  },
  {
    id: 8,
    title: 'Appointment App',
    description: 'Scheduling application with role-based access and booking management.',
    tech: ['Svelte', 'SvelteKit', 'API'],
    icon: '📅',
    category: 'svelte',
    github: '#',
    demo: null
  },
]

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'python', label: 'Python' },
  { id: 'php', label: 'PHP' },
  { id: 'laravel', label: 'Laravel' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'react', label: 'React/Next.js' },
  { id: 'svelte', label: 'Svelte' },
]

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dbProjects, setDbProjects] = useState([])

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const res = await fetch(
        'https://crqjedivobupxbbathux.supabase.co/rest/v1/projects?select=*&order=created_at.desc',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'
          }
        }
      )
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setDbProjects(data.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          tech: p.tech_stack || [],
          icon: '🚀',
          category: p.category || 'project',
          github: p.github_url,
          demo: p.demo_url
        })))
      }
    } catch (error) {
      console.log('Using default projects')
    }
  }

  const allProjects = [...projects, ...dbProjects]

  const filteredProjects = allProjects.filter(project => 
    selectedCategory === 'all' || project.category === selectedCategory
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-zinc-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-indigo-500">Portfolio</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            A collection of projects showcasing my skills in full-stack development
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project, index) => (
              <Card key={project.id} className="card-animate" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="h-40 bg-zinc-800 flex items-center justify-center text-5xl">
                  {project.icon}
                </div>
                <CardContent>
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">{project.description}</CardDescription>
                  
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(project.tech || []).slice(0, 3).map(tech => (
                      <span key={tech} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    {project.demo && (
                      <Button size="sm" className="flex-1">Live Demo</Button>
                    )}
                    {project.github && (
                      <Button size="sm" variant="outline" className="flex-1">GitHub</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Work Together?</h2>
          <p className="text-zinc-400 mb-8">
            I'm always open to discussing new projects and opportunities
          </p>
          <Button size="lg">Get In Touch</Button>
        </div>
      </section>
    </div>
  )
}