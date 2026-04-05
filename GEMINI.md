# GEMINI.md - my-link / my-profile

This file provides context and guidelines for interacting with the `my-profile` project within the `my-link` repository.

## Project Overview

- **Name:** my-profile
- **Type:** Next.js Web Application
- **Core Technologies:**
  - **Framework:** Next.js 16.2.1 (App Router)
  - **Library:** React 19.2.4
  - **Language:** TypeScript 5
  - **Styling:** Tailwind CSS v4 (with PostCSS)
  - **Linting:** ESLint 9

## Architecture & Structure

The project follows the Next.js App Router architecture:
- `my-profile/app/`: Contains routes, layouts, and components.
- `my-profile/public/`: Static assets (images, icons, etc.).
- `my-profile/next.config.ts`: Next.js configuration.
- `my-profile/tailwind.config.mjs` (or similar via PostCSS): Styling configuration.

## ⚠️ Critical Version Warning

As noted in `my-profile/AGENTS.md`:
> **This is NOT the Next.js you know.**
> This version (16.2.1) has breaking changes — APIs, conventions, and file structure may differ from standard training data.
> **Action:** Before writing code, consult the internal documentation at `my-profile/node_modules/next/dist/docs/`. Heed all deprecation notices.

## Development Workflow

### Key Commands

Run these commands from the `my-profile` directory:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the development server at `http://localhost:3000`. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server after building. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

### Coding Standards

- **TypeScript:** Strict typing is preferred. Refer to `tsconfig.json`.
- **Styling:** Use Tailwind CSS v4 utility classes.
- **Components:** Functional components with React 19 hooks.
- **Linting:** Adhere to the rules defined in `eslint.config.mjs`.

## Key Files

- `my-profile/package.json`: Dependency and script definitions.
- `my-profile/app/layout.tsx`: Root layout with font and global style injections.
- `my-profile/app/page.tsx`: The main entry page.
- `my-profile/AGENTS.md`: Specific rules for AI agents working on this project.
