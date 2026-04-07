# Detailed Merge Plan: Therapy Monorepo Expansion

This guide outlines the exact, step-by-step process to combine the **Mission Statement** and **Brain Dump** apps into a single Next.js monorepo served under `platform.mantracare.com/therapy`.

## Phase 1: Clean Slate & Structure

1. **Reset Project**: Delete all files in the current `src/` directory to remove previous merge attempts.
2. **Folder Architecture**:
   - `src/app/mission_statement/`: The entry point for the Mission app.
   - `src/app/brain_dump/`: The entry point for the Brain Dump app.
   - `src/components/mission/`: All original Mission UI components.
   - `src/components/brain_dump/`: All original Brain Dump UI components.
   - `src/lib/`: Shared utilities (DB, Auth).

## Phase 2: Styling Isolation (The "No-Bleed" Rule)

Since both apps use Shadcn/Tailwind with different colors for `--primary`, we must wrap them in **CSS scopes**:

1. **Update `globals.css`**: Define two theme classes:
   ```css
   .theme-mission {
     /* Paste Mission Statement variables here */
   }
   .theme-brain-dump {
     /* Paste Brain Dump variables here */
   }
   ```
2. **Apply Scopes**: Wrap the root of each app in its respective class:
   ```tsx
   // src/app/mission_statement/page.tsx
   <div className="theme-mission min-h-screen">...</div>
   ```

## Phase 3: Unified i18n Translations

1. **Consolidate Locales**: Create a unified `src/i18n/locales/` directory.
2. **Namespace JSON**: For each language (e.g., `en.json`), merge the content from both apps into separate keys:
   ```json
   {
     "mission": { ...mission_translations },
     "brain_dump": { ...brain_dump_translations }
   }
   ```
3. **Update Components**: Change translation calls:
   - `t('intro_title')` → `t('mission.intro_title')`
   - `t('welcome')` → `t('brain_dump.welcome')`

## Phase 4: Path-Preserving Authentication

1. **Shared AuthProvider**: Implement the redirect logic in `src/providers/AuthProvider.tsx`.
   - **Step A**: On mount, if `token` is missing and `user_id` is missing, save `window.location.pathname` to `sessionStorage.redirect_path`.
   - **Step B**: Redirect to `web.mantracare.com/app/therapy` for auth.
   - **Step C**: Upon return with `token`, call the verification API and restore the user to the saved `redirect_path`.

## Phase 5: Neon Database Setup

Use the **Neon MCP** (or run these SQL commands) to initialize the DB:

1. **Schemas**: Create `mission_statement` and `brain_dump` schemas.
2. **Tables**:
   - `core.users`: Shared user registry (`id`, `email`).
   - `mission_statement.missions`: Fields: `user_id`, `statement`, `values`, `created_at`.
   - `brain_dump.sessions`: Fields: `user_id`, `thoughts`, `reflection`, `created_at`.
3. **DB Client**: Update `src/lib/db.ts` to switch schemas dynamically based on the app being accessed.

## Phase 6: Build & Standalone Cleanup

1. **Next.js Config**:
   - Set `output: 'standalone'`.
   - Set `basePath: '/therapy'`.
2. **Docker Update**:
   - Ensure `libc6-compat` is installed.
   - Set `NODE_OPTIONS="--max-old-space-size=4096"` to prevent build failures.

## Phase 7: Deployment

1. Build the image: `docker build -t therapy:1.0 .`
2. Push to Harbor: `bunker.mantracare.com/lovable/therapy:1.0`.
