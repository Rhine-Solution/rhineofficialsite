# Rhine Solution Official Site - Complete Documentation

## 1. Project Overview

### Technology Stack
- **Frontend Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + DaisyUI
- **3D Graphics:** Three.js with WebGPU API
- **Authentication:** Supabase (via @supabase/supabase-js)
- **Routing:** React Router DOM v7
- **Animations:** GSAP
- **Icons:** Lucide React

### Project Structure
```
rhineofficialsite/
├── src/
│   ├── App.tsx              # Root component with providers
│   ├── App.css             # Global styles (snake button animations)
│   ├── routes/
│   │   └── AppRoutes.tsx   # All 30+ route definitions (lazy-loaded)
│   ├── auth/
│   │   ├── AuthModalProvider.tsx   # Context + hook for auth modal
│   │   ├── AuthModal.tsx          # Login/Register/Forgot password modal
│   │   ├── ProtectedRoute.tsx    # Route guard using Supabase auth
│   │   └── AuthButton.tsx        # Styled auth buttons
│   ├── components/
│   │   ├── Header.tsx     # Dynamic Island nav + mega menu
│   │   ├── Layout.tsx    # Page layout wrapper
│   │   ├── GFX.tsx      # SVG icons and logo
│   │   ├── SideMenu.tsx  # Mobile navigation
│   │   └── Footer.tsx   # Site footer
│   ├── lib/
│   │   ├── supabase.ts   # Supabase client config
│   │   ├── Root.ts     # WebGL context + animation loop
│   │   └── elements/
│   │       └── LinkedParticles.ts  # WebGPU particle system
│   └── pages/
│       ├── Home.tsx        # Landing page with hero
│       ├── Services/       # 4 service pages
│       ├── Solutions/      # 5 solution pages
│       ├── Technology/    # 4 tech pages
│       ├── Resources/    # 4 resource pages
│       ├── Contact.tsx   # Contact form
│       ├── Admin.tsx    # Admin panel (public)
│       └── Dashboard.tsx # Protected user dashboard
├── tailwind.config.js        # DaisyUI + custom theme
└── vite.config.ts        # Custom base path + reload plugin
```

---

## 2. Build System

### npm Scripts
| Command | Description |
|---------|------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | ESLint static analysis |
| `npm run preview` | Preview production build |

### vite.config.ts Details
- Base path: `#/random/webgputests/linked/` (for routing fallback)
- Build target: `esnext` (latest browser features)
- Custom plugin: Forces full reload on hot updates
- Three.js excluded from optimizeDeps (WebGPU compatibility)

---

## 3. Routing Architecture

### Route Structure (30+ routes in AppRoutes.tsx)

| Path | Page | Category |
|------|------|---------|
| `/` | Home | Main |
| `/services` | Services | Services |
| `/services/web-development` | WebDevelopment | Services |
| `/services/cloud-infrastructure` | CloudInfrastructure | Services |
| `/services/it-consulting` | ITConsulting | Services |
| `/services/digital-transformation` | DigitalTransformation | Services |
| `/solutions` | Solutions | Solutions |
| `/solutions/enterprise-software` | EnterpriseSoftware | Solutions |
| `/solutions/ai-automation` | AIAutomation | Solutions |
| `/solutions/cybersecurity-suite` | CybersecuritySuite | Solutions |
| `/solutions/data-analytics` | DataAnalytics | Solutions |
| `/technology` | Technology | Technology |
| `/technology/webgpu-3d` | WebGPU3D | Technology |
| `/technology/blockchain-web3` | BlockchainWeb3 | Technology |
| `/technology/iot-edge` | IoTEdge | Technology |
| `/technology/custom-apis` | CustomAPIs | Technology |
| `/resources` | Resources | Resources |
| `/resources/case-studies` | CaseStudies | Resources |
| `/resources/documentation` | Documentation | Resources |
| `/resources/blog-insights` | BlogInsights | Resources |
| `/resources/support-community` | ForumRedirect (discourse.group) | Resources |
| `/contact` | Contact | Contact |
| `/admin` | AdminPage | Admin (public) |
| `/dashboard` | DashboardPage | Protected |
| `/privacy` | Privacy | Legal |
| `/terms` | Terms | Legal |
| `*` | NotFound | 404 |

### Key Features
- Lazy loading with `React.lazy()` + `Suspense`
- ForumRedirect component auto-redirects `/resources/support-community` to Discourse
- ProtectedRoute wraps dashboard with Supabase auth check

---

## 4. Authentication System

### Supabase Integration
```
src/lib/supabase.ts:
- Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars
- Session persistence enabled
- URL-based session detection enabled
```

**Auth Files:**
- `AuthModalProvider.tsx`: React Context for modal state
- `AuthModal.tsx`: Full login/register/forgot UI
- `ProtectedRoute.tsx`: Supabase getUser() check, redirects on failure
- `AuthButton.tsx`: Reusable styled button component

### Auth Flow
1. User clicks login/register → `authModal.open(tab)`
2. Modal renders with form validation
3. `supabase.auth.signInWithPassword()` or `signUp()`
4. On success: redirect to `/dashboard`

---

## 5. 3D/WebGPU System

### Core Files
- `src/lib/Root.ts`: Initializes WebGL context, animation loop
- `src/lib/elements/LinkedParticles.ts`: 16,384 particle system with GPU compute
- `src/lib/utils/Pointer.ts`: Cursor position handler

### LinkedParticles Features
- Particles spawn at cursor position
- Move via fractal noise turbulence field
- Each particle linked to 2 nearest neighbors via quad mesh
- Hexagonal pattern background with noise
- Post-processing: Bloom, RGB shift, anamorphic lens
- lil-gui for real-time parameter tweaking

### Home Page Integration
```typescript
// Home.tsx uses:
// - WebGPU.isAvailable() check
// - Root.zoomPercent for HUD display
// - Theme color cycling via requestAnimationFrame
```

---

## 6. UI Components

### Header.tsx - Dynamic Island Design
- Fixed position "pill" nav on desktop
- Mega menu dropdowns per category
- Responsive: hamburger menu on mobile
- Theme color support (customizable via prop)
- Auth buttons (optional display)

### GFX.tsx - SVG Assets
- Rhine logo (R letter mark)
- Social icons (Twitter, GitHub)
- UI icons (crosshair, brightness, tools, etc.)

### Layout.tsx
- Wraps pages with Header/Footer
- Passes theme color to components

---

## 7. Opencode Multi-Agent System

Located in `.opencode/prompts/` - 9 specialized agents:

### Agent Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                     WORKFLOW STATE                          │
├──────────────┬──────────────┬──────────────────────────────┤
│ Phase        │ Next Phase   │ Agent                        │
├──────────────┼──────────────┼──────────────────────────────┤
│ research     │ design       │ researcher → architect       │
│ design       │ implement    │ architect (fork both)        │
│ implement    │ test        │ frontend + backend            │
│ test         │ security    │ tester                        │
│ security     │ review      │ security                      │
│ review       │ deploy      │ reviewer                      │
│ deploy       │ done        │ devops                        │
└──────────────┴──────────────┴──────────────────────────────┘
```

### Agent Descriptions

| Agent | File | Role | Tools |
|-------|------|------|-------|
| **Leader** | `leader.md` | Orchestrate workflow, NEVER implement | session tool only |
| **Researcher** | `researcher.md` | Analyze codebase, gather requirements | Read, Glob, Grep, session fork |
| **Architect** | `architect.md` | Design component boundaries, API contracts | Read, Glob, Grep, session fork |
| **Frontend** | `frontend.md` | React UI implementation | Write, Edit, Read, Glob, Grep |
| **Backend** | `backend.md` | API + business logic | Write, Edit, Read, Glob, Grep |
| **Tester** | `tester.md` | Validate functionality | Bash (npm run build/lint), Write, Read |
| **Security** | `security.md` | Scan vulnerabilities | Read, Grep, Glob |
| **Reviewer** | `reviewer.md` | Code review | Read, Grep |
| **DevOps** | `devops.md` | Dockerfile + CI/CD | Write, Edit, Bash |

### Session Tool Modes

```javascript
// message - Sequential handoff
session({ mode: "message", agent: "frontend", text: "..." })

// new - Clean phase transition
session({ mode: "new", agent: "architect", text: "..." })

// fork - Parallel exploration
session({ mode: "fork", agent: "frontend", text: "Design A" })
session({ mode: "fork", agent: "frontend", text: "Design B" })

// compact - Compress state
session({ mode: "compact", agent: "leader", text: "..." })
```

### Leader Rules

- **NEVER implement directly** - always delegate
- Use session tool for all handoffs
- Track workflow phases
- Make deterministic decisions

### Researcher Output Format

```markdown
## Research Findings

### Project Overview
- Framework: [React + Vite]
- Styling: [Tailwind CSS]
- Key dependencies: [...]

### Existing Code
- [List relevant files]

### Approaches Explored
1. Approach A: [description] - [pros/cons]
2. Approach B: [description] - [pros/cons]

### Recommendations
- Recommended approach: [X]
- Rationale: [why]
```

---

## 8. Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# TypeScript check + build
npm run build

# Run linter
npm run lint

# Preview production build locally
npm run preview
```

---

## 9. Environment Variables

Required in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 10. Deployment

### Build for Production
```bash
npm run build
```
Output in `dist/` folder.

### Preview Locally
```bash
npm run preview
```

---

## 11. Key Implementation Details

### Route Definitions (AppRoutes.tsx)
All routes are lazy-loaded using React.lazy() for code splitting. Each route maps to a page component in `src/pages/`.

### Theme System
- Theme color is passed via props through the component tree
- Default theme: `#4f46e5` (indigo)
- Home page cycles through HSL hues dynamically

### Protected Routes
Dashboard route (`/dashboard`) is wrapped in ProtectedRoute which:
1. Calls `supabase.auth.getUser()`
2. Redirects to home if no user
3. Shows loading spinner while checking

### Mobile Responsiveness
Header component uses matchMedia to detect desktop (≥1024px) vs mobile, switching between Dynamic Island pill and hamburger menu.

### WebGPU Feature Detection
Home page checks `WebGPU.isAvailable()` to conditionally render 3D content.

---

*Generated for Rhine Solution Official Site*