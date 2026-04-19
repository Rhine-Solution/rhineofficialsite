// Rhine Official Site - JavaScript with Supabase Integration

const FALLBACK_PROJECTS = [
    { title: 'Python Chatbot', description: 'Interactive CLI chatbot demonstrating Python fundamentals with menus, loops, and functions.', category: 'python', tech_stack: ['Python', 'CLI'], image_emoji: '🐍' },
    { title: 'Book Manager', description: 'Book management system with JSON storage, search, and statistics features.', category: 'python', tech_stack: ['Python', 'JSON', 'File I/O'], image_emoji: '📚' },
    { title: 'PHP Webshop', description: 'E-commerce platform with user authentication, shopping cart, and admin panel.', category: 'php', tech_stack: ['PHP', 'MySQL', 'Supabase'], image_emoji: '🛒' },
    { title: 'OOP Portfolio', description: 'Object-oriented portfolio with classes, inheritance, and design patterns.', category: 'php2', tech_stack: ['PHP', 'OOP', 'PSR-12'], image_emoji: '💼' },
    { title: 'Laravel Job Board', description: 'Full-stack job board application with authentication and admin dashboard.', category: 'laravel', tech_stack: ['Laravel', 'PHP', 'Blade'], image_emoji: '💼' },
    { title: 'Portfolio Website', description: 'Responsive portfolio website with modern dark theme and animations.', category: 'frontend', tech_stack: ['HTML', 'CSS', 'JavaScript'], image_emoji: '🎨' },
    { title: 'Sunny Travels', description: 'Travel booking application with React, filtering, and booking functionality.', category: 'nextjs', tech_stack: ['React', 'Next.js', 'Vite'], image_emoji: '✈️' },
    { title: 'Appointment App', description: 'Scheduling application with role-based access and booking management.', category: 'svelte', tech_stack: ['Svelte', 'SvelteKit', 'API'], image_emoji: '📅' }
];

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initContactForm();
    initSkillBars();
    loadProjects();
    loadBooks();
});

async function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    try {
        if (window.supabase) {
            const projects = await window.supabase.getProjects();
            if (projects && projects.length > 0) {
                renderProjects(projects);
                return;
            }
        }
    } catch (e) {
        console.log('Supabase not available, using fallback projects');
    }

    renderProjects(FALLBACK_PROJECTS);
}

function renderProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projects.map((project, index) => {
        const emoji = project.image_emoji || project.image_url || '🚀';
        const techTags = (project.tech_stack || project.tech_stack_array || []).map(tech => 
            `<span>${tech}</span>`
        ).join('');

        return `
            <article class="project-card" style="animation-delay: ${index * 0.1}s">
                <div class="project-image">
                    <span class="project-icon">${emoji}</span>
                </div>
                <div class="project-content">
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description)}</p>
                    <div class="project-tags">
                        ${techTags}
                    </div>
                    <a href="${project.demo_url || project.github_url || '#'}" class="project-link">
                        ${project.demo_url ? 'Live Demo' : 'View Project'} →
                    </a>
                </div>
            </article>
        `;
    }).join('');
}

async function loadBooks() {
    try {
        if (window.supabase) {
            const books = await window.supabase.getBooks();
            if (books && books.length > 0) {
                console.log('Books from Supabase:', books);
            }
        }
    } catch (e) {
        console.log('No books available');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.project-card, .skill-category, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            if (window.supabase) {
                await window.supabase.request('reviews', {
                    method: 'POST',
                    body: JSON.stringify({
                        comment: data.message,
                        rating: 5,
                        created_at: new Date().toISOString()
                    })
                });
            }
            
            alert(`Thanks ${data.name}! Your message has been sent.`);
            form.reset();
        } catch (error) {
            alert(`Thanks ${data.name}! Your message has been sent.`);
            form.reset();
        }
    });
}

function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debounce, loadProjects, loadBooks };
}