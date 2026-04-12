# Contributing to Rhine Solution Website

Welcome! We're excited you're interested in contributing to our project.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rhinesolution/website.git
   cd website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/     # React components
├── pages/          # Route pages
├── hooks/          # Custom React hooks
├── lib/            # Utilities and libraries
├── i18n/           # Internationalization
├── auth/           # Authentication (Supabase)
└── stories/        # Storybook stories
```

## Coding Standards

- Use **TypeScript** for all new code
- Follow existing component patterns
- Use Tailwind CSS for styling
- Run `npm run build` before committing

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run storybook` | Start Storybook |

## Testing

- **Unit tests**: Run `npm run test`
- **E2E tests**: Run `npm run test:e2e`
- **Storybook**: Run `npm run storybook`

## Git Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit
3. Push to your fork and create a PR
4. Ensure CI passes

## Questions?

- Open an issue for bugs or feature requests
- Join our Discord for discussions