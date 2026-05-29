# GEMINI.md - MyLink Project Guidelines

This file defines the development context and rules for the MyLink project. All interactions must prioritize the instructions in this document.

## 1. Project Overview
**MyLink** is a "Link-in-Bio" service for developers and creators to aggregate various links (portfolio, GitHub, SNS, etc.) into a single profile page.

### Tech Stack
- **Framework:** Next.js 16.2.6 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Backend/Auth:** Firebase (Authentication, Firestore)
- **Language:** TypeScript
- **Theme:** next-themes (Dark mode support)

## 2. Core Features & Architecture
### Service Flow
1. **Landing/Login:** Google Social Login integration.
2. **Username Setup:** Initial user identifier setup.
3. **Admin Dashboard:** Link management (CRUD, sorting) and profile editing. Provides a **real-time mobile preview**.
4. **Public Profile:** Final profile page visible to external visitors.

### UI Components (Based on Wireframes)
- **Admin Dashboard:** Top navigation (Links, Appearance, Settings), left link management area, right real-time mobile preview area.
- **Public Profile Page:** Header with avatar/name/bio, list of link buttons with favicons, rich media embeds (YouTube/GitHub), social icons, and branding footer.
- **Share Modal:** QR code generation for the profile URL, download options, and link copying.

### Database Structure (Firestore)
- **Users Collection (`/users/{uid}`):** Basic user info (username, displayName, photoURL, bio)
- **Links Subcollection (`/users/{uid}/links/{linkId}`):** Individual link data (title, url, faviconUrl, order, isActive, etc.)

### Key Features
- **Auth:** Google Social Login only.
- **Profile:** Unique Username-based URL (`domain.com/{username}`), inline editing support.
- **Link Management:** CRUD, inline editing, drag-and-drop sorting, active/inactive toggle.
- **Media:** YouTube embeds, highlight animation effects.
- **Sharing:** Automatic QR code generation.

## 3. Development & Build Commands
Use the following commands during development:
- **Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Format:** `npm run format`
- **Type Check:** `npm run typecheck`
- **Add UI Component (shadcn):** `npx shadcn@latest add [component-name]`

## 4. Development Rules & Conventions
- **Language:** All explanations, tasks, plans, and commit messages must be written in **English** (to optimize token usage).
- **File References:** Always prefix files or paths with `@` (e.g., `@package.json`, `@app/layout.tsx`).
- **Design Principles:** Adhere to Mobile-First responsive design and actively use shadcn/ui's design system.
- **Data Management:** Link data must be managed as a subcollection under the user for scalability and security.
- **Validation:** Always verify changes with `npm run build` and `npm run typecheck` after development.
- **Inline Editing:** Prioritize inline editing on the current screen instead of navigating to separate edit pages for better UX.

## 5. Project Structure
- `app/`: Next.js App Router pages and layouts
- `components/`: UI and common components
  - `components/ui/`: shadcn/ui components
- `docs/`: PRD, User Scenarios, Wireframes
- `hooks/`: Custom React Hooks
- `lib/`: Utilities and config (e.g., Firebase config)
- `public/`: Static assets
