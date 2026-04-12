# Rhine Official Site

A React + TypeScript website with Three.js 3D effects, Supabase auth, and modern UI.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, DaisyUI
- **3D**: Three.js, WebGPU, Spline
- **Auth**: Supabase
- **Routing**: React Router DOM (lazy loading)

## Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview # Preview production build
```

---

## What's New (Latest Updates)

### SEO Features
- Meta tags (description, keywords, OG, Twitter Cards)
- robots.txt - Blocks AI bots, allows search engines
- sitemap.xml - 24 pages indexed

### New Pages
- **About** (`/about`) - Company story, team, values
- **Portfolio** (`/portfolio`) - Project showcase with filters

### New Components
- `TeamCard` - Team member display
- `PortfolioCard` - Project showcase card
- `FilterButtons` - Category filter for portfolio
- `ValueCard` - Values/features display
- `ProcessTimeline` - Process steps display

### Brand Colors (from Excel)
- Primary: `#0082D8`
- Secondary: `#ffffff`

---

## Site Structure

### Pages (25 total)
| Route | Page | Status |
|-------|------|--------|
| `/` | Home | ✅ |
| `/about` | About | ✅ NEW |
| `/portfolio` | Portfolio | ✅ NEW |
| `/services` | Services | ✅ |
| `/services/web-development` | Web Development | ✅ |
| `/services/cloud-infrastructure` | Cloud Infrastructure | ✅ |
| `/services/it-consulting` | IT Consulting | ✅ |
| `/services/digital-transformation` | Digital Transformation | ✅ |
| `/solutions` | Solutions | ✅ |
| `/solutions/enterprise-software` | Enterprise Software | ✅ |
| `/solutions/ai-automation` | AI & Automation | ✅ |
| `/solutions/cybersecurity-suite` | Cybersecurity Suite | ✅ |
| `/solutions/data-analytics` | Data Analytics | ✅ |
| `/technology` | Technology | ✅ |
| `/technology/webgpu-3d` | WebGPU 3D | ✅ |
| `/technology/blockchain-web3` | Blockchain Web3 | ✅ |
| `/technology/iot-edge` | IoT & Edge | ✅ |
| `/technology/custom-apis` | Custom APIs | ✅ |
| `/resources` | Resources | ✅ |
| `/contact` | Contact | ✅ |
| `/dashboard` | Dashboard (protected) | ✅ |
| `/admin` | Admin | ✅ |
| `/privacy` | Privacy | ✅ |
| `/terms` | Terms | ✅ |

### Components
```
src/components/
├── Header.tsx          # Navigation with mega menu
├── Footer.tsx         # Site footer
├── SideMenu.tsx       # Mobile side menu
├── Layout.tsx         # Main layout wrapper
├── GFX.tsx            # 3D graphics, logos
├── threeroot.tsx      # Three.js scene
├── NestedRoot.tsx    # Nested 3D scenes
├── LoadingSpinner.tsx
├── ScrollToTop.tsx
├── ErrorBoundary.tsx
├── Collapsable.tsx
├── LargeCollapsable.tsx
├── SettingsModal.tsx
├── TeamSettingsModal.tsx
├── InviteModal.tsx
├── IntroModal.tsx
├── InfoModal.tsx
├── UserDropdown.tsx
├── TeamCard.tsx       # NEW
├── PortfolioCard.tsx # NEW
├── FilterButtons.tsx  # NEW
├── ValueCard.tsx     # NEW
└── ProcessTimeline.tsx # NEW
```

---

## Agent System (15 Specialized Agents)

This project uses opencode with 15 specialized agents coordinated by the Leader for efficient development.

### Core Workflow (3 Agents)
| Agent | Purpose |
|-------|---------|
| `leader` | Orchestrator - coordinates all 14 agents |
| `researcher` | Investigate codebase, gather requirements |
| `architect` | Design component structure, API boundaries |

### Implementation (6 Agents)
| Agent | Purpose |
|-------|---------|
| `frontend` | UI components, pages, styling |
| `backend` | APIs, business logic, database |
| `3d-specialist` | Three.js, WebGL, particle systems |
| `database` | Supabase schema, migrations |
| `ui-designer` | UI/UX design, color schemes |
| `auth-expert` | Auth flows, OAuth, tokens |

### Quality & Operations (6 Agents)
| Agent | Purpose |
|-------|---------|
| `tester` | Write and run tests |
| `security` | Scan vulnerabilities |
| `reviewer` | Code quality review |
| `devops` | Dockerfiles, CI/CD |
| `performance` | Bundle optimization |
| `docs-writer` | Documentation |

---

## Session Tool Modes

| Mode | Use Case |
|------|----------|
| `message` | Hand off task with full context |
| `new` | Start clean phase (no context bleed) |
| `fork` | Explore alternatives in parallel |
| `compact` | Compress conversation history |

---

## Workflow Phases

```
1. RESEARCH    → researcher investigates
2. DESIGN      → architect creates design
3. IMPLEMENT   → frontend + backend + 3d (fork)
4. TEST        → tester validates
5. SECURITY    → security scans
6. REVIEW      → reviewer checks quality
7. DEPLOY      → devops prepares release
```

---

## Project File Structure

```
rhineofficialsite/
├── src/
│   ├── components/           # React UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SideMenu.tsx
│   │   ├── Layout.tsx
│   │   ├── GFX.tsx
│   │   ├── threeroot.tsx
│   │   ├── TeamCard.tsx      # NEW
│   │   ├── PortfolioCard.tsx # NEW
│   │   ├── FilterButtons.tsx # NEW
│   │   ├── ValueCard.tsx     # NEW
│   │   └── *.tsx
│   ├── pages/                # Page components
│   │   ├── Home.tsx
│   │   ├── About/            # NEW
│   │   │   └── About.tsx
│   │   ├── Portfolio/        # NEW
│   │   │   └── Portfolio.tsx
│   │   ├── Services/
│   │   ├── Solutions/
│   │   ├── Technology/
│   │   ├── Resources/
│   │   ├── Contact.tsx
│   │   ├── Dashboard.tsx
│   │   └── Admin.tsx
│   ├── auth/                 # Supabase auth
│   │   ├── AuthModal.tsx
│   │   ├── AuthModalProvider.tsx
│   │   ├── AuthButton.tsx
│   │   └── ProtectedRoute.tsx
│   ├── lib/                  # Utilities
│   │   ├── supabase.ts
│   │   ├── Root.ts           # Three.js scene
│   │   ├── elements/
│   │   │   └── LinkedParticles.ts
│   │   └── utils/
│   ├── hooks/
│   │   └── useThemeHue.ts
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── docs/                     # Planning documents
├── tailwind.config.js
├── vite.config.ts
├── opencode.json             # Agent config (15 agents)
└── package.json
```

---

## Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 3D Components

| Component | Purpose |
|-----------|---------|
| `lib/Root.ts` | Main Three.js scene setup |
| `lib/elements/LinkedParticles.ts` | WebGPU particle system |
| `components/threeroot.tsx` | React Three.js wrapper |
| `components/GFX.tsx` | Graphics components, logos |

---

## Design System

### Colors
- Primary: `#0082D8` (brand-primary)
- Secondary: `#ffffff`
- Background: `#0a0a0a` (dark default)
- Text: White with opacity variations (white/60, white/40, etc.)

### Styles
- Glass effect: `bg-black/80 backdrop-blur-xl`
- Borders: `border-white/10`, `border-white/20`
- Typography: Uppercase with tracking
- Buttons: Border style with hover effects

---

## SEO Features

The site includes comprehensive SEO optimization:

### Meta Tags (index.html)
- Description: "Rhine Solution - Innovative digital solutions with WebGPU 3D, AI, Cloud & Enterprise Software"
- Keywords: WebGPU, WebGL, 3D rendering, blockchain, Web3, AI automation, cloud infrastructure, enterprise software
- Open Graph: Proper OG tags for social sharing
- Twitter Cards: Twitter summary_large_image

### robots.txt
- Blocks AI bots (ChatGPT, Claude, Google-Extended, etc.)
- Allows standard search engine crawlers

### sitemap.xml
- 24 URLs indexed covering all pages
- Priority scores: 1.0 for homepage, 0.8 for main sections, 0.6 for sub-pages
- Weekly changefrequency

---

## Contributing

### Development Workflow
1. **Research** → Use `researcher` agent to investigate requirements
2. **Design** → Use `architect` agent to design the solution  
3. **Implementation** → Fork to `frontend`, `backend`, `3d-specialist` as needed
4. **Testing** → Test with `tester`
5. **Security** → Scan with `security` agent
6. **Review** → Code review with `reviewer`
7. **Deploy** → Prepare release with `devops`

### Code Standards
- Use TypeScript for all new code
- Follow existing component patterns (glass effects, dark theme)
- Brand color: `#0082D8` (use useThemeHue hook for dynamic theming)
- Run `npm run build` before committing
- Lazy load new pages with React.lazy()

### Adding New Pages
1. Create page in `src/pages/`
2. Add to `AppRoutes.tsx` with lazy loading
3. Add navigation in Header and SideMenu
4. Update sitemap.xml if needed

### Adding New Components
1. Follow existing patterns in `src/components/`
2. Use glass effect: `bg-black/80 backdrop-blur-xl border border-white/10`
3. Support themeColor prop for brand consistency
4. Add to appropriate category in component list

---

## Notes

- All new pages use the `Layout` component for consistent 3D background
- Routes use React.lazy() for code splitting
- Mobile responsive design included
- Theme color is configurable via props