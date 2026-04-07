# 🚀 Monorepo Expansion: Merging Master Guide

Use this guide and the included prompt template to merge 30-50+ independent apps into this monorepo. This architecture ensures **zero-bleed** between apps while sharing a single **Neon Database** and **Auth Portal**.

---

## 🏗️ Core Architecture Principles

### 1. Styling Isolation (CSS Scoping)
To prevent Tailwind/Shadcn collisions, every app MUST be wrapped in a CSS class scope.
- **Action**: Define `.theme-<slug>` in `globals.css` (e.g., `.theme-brain-dump`).
- **Usage**: Wrap the app's root component in this class. 
- **Result**: Primary colors and UI styles from one app will never affect another.

### 2. Database Isolation (Multi-Schema Proxy)
We use **one database** with **many schemas** (namespaces) to isolate app data.
- **Users**: Always reside in the `core.users` table.
- **App Data**: Every app gets its own schema (e.g., `mission_statement.missions`).
- **The Utility**: Use `src/lib/db.ts` which includes a SQL rewriter. It automatically redirects queries from `FROM missions` to `FROM <schema>.missions` so you don't have to rewrite every query manually.

### 3. Unified Authentication
All apps follow the same handshake to ensure the user stays logged in across the monorepo.
- **Key**: Always use `sessionStorage.getItem("therapy_user_id")`.
- **Portal**: Redirect to `https://web.mantracare.com/app/therapy?redirect_url=...` if the session is missing.
- **Persistence**: Restore the user's original path after login using `sessionStorage.redirect_path`.

### 4. Namespaced Translations (i18n)
Merge all translations into one `en.json` file to keep the bundle small.
- **Pattern**: `t("<slug>.key_name")` (e.g., `t("mission.intro_title")`).
- **Provider**: Use the root `I18nProvider` to ensure the instance is shared correctly in Next.js client components.

---

## 📝 Exemplary Integration Prompt (For Future AI/Devs)

> **Task**: Merge the \"[APP_NAME]\" project into the monorepo.
> 
> **1. Structure**:
> - Move components to `src/components/[slug]/`.
> - Create page at `src/app/[slug]/page.tsx`.
> - Create DB utilities in `src/lib/[slug]/db.ts` using the shared `executeQuery` from `@/lib/db`.
> 
> **2. Styling**:
> - Wrap the root `page.tsx` in `<div className="theme-[slug] min-h-screen">`.
> - Add the theme variables to `globals.css` under `.theme-[slug]`.
> 
> **3. Auth**:
> - Replace all `localStorage`/`sessionStorage` user ID lookups with `sessionStorage.getItem("therapy_user_id")`.
> - Ensure the `AuthProvider` covers the new route.
> 
> **4. Database**:
> - Propose an `init_[slug].ts` script to create a schema named `[slug]` and relevant tables.
> - Ensure IDs use `TEXT` and arrays use `TEXT[]` or `JSONB` for compatibility with the monorepo rewriter.
> 
> **5. i18n**:
> - Move translations to the `[slug]` key within `src/i18n/locales/en.json`.
> - Update all `t()` calls to use the `[slug].` prefix.

---

## 🛠️ Build & CI/CD Specs
- **Node Version**: 20+
- **Docker Strategy**: `output: 'standalone'` in `next.config.ts`.
- **Memory Management**: `--max-old-space-size=4096` during build.
- **Registry**: `bunker.mantracare.com/lovable/therapy:1.0`
