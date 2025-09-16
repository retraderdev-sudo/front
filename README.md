# Retrader Frontend

Next.js 14 frontend application for the Retrader trading platform.

## Features

- **Modern UI**: TailwindCSS + shadcn/ui components
- **Authentication**: Zustand store for state management
- **Internationalization**: English and Persian support with next-intl
- **Theme Switching**: Light/Dark/System themes with next-themes
- **Protected Routes**: Middleware-based route protection
- **Responsive Design**: Mobile-first approach

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand
- next-intl
- next-themes
- Axios

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Copy `env.local.example` to `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Run the application**

   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm run start
   ```

## Development

### Code Style

- ESLint + Prettier configured
- Format on save enabled
- TypeScript strict mode
- TailwindCSS class sorting

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── [locale]/       # Internationalized routes
│   ├── globals.css     # Global styles
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── theme-toggle.tsx
│   └── language-switcher.tsx
├── hooks/             # Custom hooks
├── lib/               # Utilities
├── store/             # Zustand stores
└── middleware.ts      # Next.js middleware
```

## Features

### Authentication

- JWT token management
- Automatic token refresh
- Protected routes
- Login/logout functionality

### Internationalization

- English and Persian support
- Language switcher
- RTL support for Persian

### Theme System

- Light/Dark/System themes
- Theme persistence
- Theme toggle component

## License

This project is licensed under the MIT License.
