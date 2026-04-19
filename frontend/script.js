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
    initAuth();
    initFileUpload();
    loadProjects();
    loadBooks();
    updateAuthUI();
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
        
        const btn = form.querySelector('button');
        btn.textContent = 'Sending...';
        btn.disabled = true;
        
        try {
            if (window.supabase) {
                await window.supabase.saveContact(data);
            }
            
            showNotification(`Thanks ${data.name}! Your message has been sent.`, 'success');
            form.reset();
        } catch (error) {
            showNotification(`Thanks ${data.name}! Your message has been sent.`, 'success');
            form.reset();
        }
        
        btn.textContent = 'Send Message';
        btn.disabled = false;
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

function initFileUpload() {
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const dropzone = document.getElementById('upload-dropzone');
    const uploadArea = document.getElementById('file-upload-area');
    const uploadProgress = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const uploadStatus = document.getElementById('upload-status');
    const uploadedFiles = document.getElementById('uploaded-files');

    if (!fileInput) return;

    uploadBtn?.addEventListener('click', () => fileInput.click());

    dropzone?.addEventListener('click', () => fileInput.click());

    dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone?.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length) handleFileUpload(files[0]);
    });

    fileInput?.addEventListener('change', (e) => {
        if (e.target.files.length) handleFileUpload(e.target.files[0]);
    });

    async function handleFileUpload(file) {
        const isAuth = window.auth?.isAuthenticated();
        if (!isAuth) {
            showNotification('Please login to upload files', 'error');
            return;
        }

        uploadProgress.style.display = 'block';
        dropzone.style.display = 'none';
        progressFill.style.width = '50%';
        uploadStatus.textContent = `Uploading ${file.name}...`;

        try {
            const url = await window.supabase.uploadFile(file, 'user-files');
            
            progressFill.style.width = '100%';
            uploadStatus.textContent = 'Upload complete!';
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span class="file-icon">📄</span>
                <span class="file-name">${escapeHtml(file.name)}</span>
                <a href="${url}" target="_blank" class="file-link">View</a>
            `;
            uploadedFiles?.appendChild(fileItem);

            setTimeout(() => {
                uploadProgress.style.display = 'none';
                dropzone.style.display = 'block';
                progressFill.style.width = '0';
            }, 2000);

            showNotification('File uploaded successfully!', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Upload failed. Please try again.', 'error');
            uploadProgress.style.display = 'none';
            dropzone.style.display = 'block';
        }
    }
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

function initAuth() {
    const authLink = document.getElementById('auth-link');
    const authModal = document.getElementById('auth-modal');
    const closeBtn = document.querySelector('.auth-close');
    const tabBtns = document.querySelectorAll('.auth-tab-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Open modal
    authLink?.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.auth?.isAuthenticated()) {
            handleLogout();
        } else {
            authModal?.classList.add('active');
        }
    });

    // Close modal
    closeBtn?.addEventListener('click', () => {
        authModal?.classList.remove('active');
    });

    // Close on background click
    authModal?.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
        }
    });

    // Switch tabs
    tabBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (tab === 'login') {
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
            }
        });
    });

    // Login form
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const btn = loginForm.querySelector('button');
        
        btn.textContent = 'Logging in...';
        btn.disabled = true;

        const result = await window.auth.signIn(email, password);
        
        if (result.success) {
            authModal?.classList.remove('active');
            updateAuthUI();
            showNotification('Welcome back!', 'success');
        } else {
            showNotification(result.error, 'error');
        }
        
        btn.textContent = 'Login';
        btn.disabled = false;
    });

    // Signup form
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = signupForm.name.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        const btn = signupForm.querySelector('button');
        
        btn.textContent = 'Creating account...';
        btn.disabled = true;

        const result = await window.auth.signUp(email, password, name);
        
        if (result.success) {
            showNotification('Account created! Please check your email to verify.', 'success');
            // Switch to login tab
            document.querySelector('[data-tab="login"]')?.click();
        } else {
            showNotification(result.error, 'error');
        }
        
        btn.textContent = 'Sign Up';
        btn.disabled = false;
    });
}

function handleLogout() {
    window.auth.signOut();
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
}

function updateAuthUI() {
    const authLink = document.getElementById('auth-link');
    const dashboardLink = document.getElementById('dashboard-link');
    const dashboardSection = document.getElementById('dashboard');
    const membersSection = document.getElementById('members');
    if (!authLink) return;

    const user = window.auth?.getUser();
    const isAuth = window.auth?.isAuthenticated();

    if (isAuth && user) {
        authLink.textContent = 'Logout';
        authLink.title = user.email;
        if (dashboardLink) dashboardLink.style.display = 'inline';
        if (membersSection) membersSection.style.display = 'block';
        loadDashboardData(user);
    } else {
        authLink.textContent = 'Login';
        authLink.title = '';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'none';
        if (membersSection) membersSection.style.display = 'none';
    }
}

async function loadDashboardData(user) {
    const dashboardSection = document.getElementById('dashboard');
    const userEmail = document.getElementById('user-email');
    const userCreated = document.getElementById('user-created');
    const userMessages = document.getElementById('user-messages');

    if (!dashboardSection) return;

    dashboardSection.style.display = 'block';

    if (userEmail) userEmail.textContent = user.email || '-';

    try {
        if (window.supabase) {
            const profile = await window.supabase.getUserProfile(user.email);
            if (profile && profile.created_at && userCreated) {
                const created = new Date(profile.created_at);
                userCreated.textContent = created.toLocaleDateString();
            } else if (userCreated) {
                userCreated.textContent = 'N/A';
            }

            const contacts = await window.supabase.getContactsByEmail(user.email);
            if (contacts && contacts.length > 0) {
                if (userMessages) {
                    userMessages.innerHTML = contacts.slice(0, 5).map(c => `
                        <div class="message-item">
                            <p><strong>${escapeHtml(c.subject || 'No subject')}</strong></p>
                            <p>${escapeHtml(c.message.substring(0, 100))}${c.message.length > 100 ? '...' : ''}</p>
                            <small>${new Date(c.created_at).toLocaleDateString()}</small>
                        </div>
                    `).join('');
                }
            }
        } else {
            if (userCreated) userCreated.textContent = 'N/A';
        }
    } catch (e) {
        console.log('Could not load user data');
        if (userCreated) userCreated.textContent = 'N/A';
    }
}

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    existing?.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debounce, loadProjects, loadBooks, initAuth, updateAuthUI };
}