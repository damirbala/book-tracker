# Book Tracker App Setup Guide

A step-by-step guide to build a simple CRUD “Book Tracker” using Next.js (App Router), TypeScript, Tailwind CSS, Supabase Auth & Database, ready for Vercel deployment.

---

## 1. Scaffold the Project

In a new, empty directory (or your repo root), run:

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --example with-supabase
```

This command bootstraps:
- Next.js 13+ App Router & TypeScript
- Tailwind CSS template
- ESLint configuration
- Supabase example with client/server helpers

---

## 2. Environment Variables

Create a file `.env.local` at project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SERVICE_ROLE_KEY>
```

- `NEXT_PUBLIC_` keys are exposed to the browser.
- `SUPABASE_SERVICE_ROLE_KEY` is only used in server actions or scripts.

---

## 3. Folder Structure

```
book-tracker/
├─ app/
│  ├─ layout.tsx            # App layout, global styles & SupabaseProvider
│  ├─ page.tsx              # Redirect to /books
│  ├─ login/page.tsx        # Client Auth UI (Supabase Auth)
│  ├─ books/
│  │  ├─ page.tsx           # List all books
│  │  ├─ new/page.tsx       # Create new book form
│  │  └─ [id]/
│  │     ├─ page.tsx        # View & edit a single book
│  │     └─ actions.ts      # Server actions: update & delete
├─ components/
│  ├─ BookForm.tsx          # Reusable form component
│  └─ BookList.tsx          # List or table UI
├─ lib/
│  ├─ supabase-browser.ts   # Client Supabase setup
│  └─ supabase-server.ts    # Server Supabase setup
├─ scripts/
│  └─ seed.ts               # Seed initial data script
├─ tailwind.config.js
├─ postcss.config.js
└─ GUIDE.md                 # This file
```

<details>
<summary>Mermaid diagram</summary>

```mermaid
graph TD
  A[book-tracker] --> B[app]
  B --> C[layout.tsx]
  B --> D[login/page.tsx]
  B --> E[books/page.tsx]
  B --> F[books/new/page.tsx]
  B --> G[books/[id]/page.tsx]
  B --> H[books/[id]/actions.ts]
  A --> I[components]
  I --> J[BookForm.tsx]
  I --> K[BookList.tsx]
  A --> L[lib]
  L --> M[supabase-browser.ts]
  L --> N[supabase-server.ts]
  A --> O[scripts/seed.ts]
```
</details>

---

## 4. Supabase Auth Integration

1. Install Auth UI:

   ```bash
   npm install @supabase/auth-ui-react @supabase/auth-helpers-nextjs
   ```

2. In `app/login/page.tsx`:
   ```tsx
   "use client"
   import { Auth } from "@supabase/auth-ui-react"
   import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

   export default function LoginPage() {
     const supabase = createClientComponentClient()
     return (
       <div className="flex items-center justify-center min-h-screen">
         <Auth supabaseClient={supabase} />
       </div>
     )
   }
   ```

3. Protect `/books` pages by checking session in server components:
   ```ts
   import { cookies } from "next/headers"
   import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
   import { redirect } from "next/navigation"

   export default async function BooksPage() {
     const supabase = createServerComponentClient({ cookies })
     const { data: { session } } = await supabase.auth.getSession()
     if (!session) redirect("/login")
     // ...
   }
   ```

---

## 5. CRUD Implementation

1. **Type Definition**  
   ```ts
   interface Book {
     id: string
     user_id: string
     title: string
     author: string
     status: "reading" | "read"
     rating: number
     notes: string
     created_at: string
   }
   ```

2. **Create**  
   - Client form → `server action` in `app/books/new/actions.ts` using `supabaseServer.from("book").insert([...])`.

3. **Read/List**  
   - In `app/books/page.tsx`, use `supabaseServer.from("book").select("*")` ordered by `created_at`.

4. **Update/Delete**  
   - In `app/books/[id]/actions.ts`, implement `update()` and `delete()` calls by `id`.

5. All server actions should initialize Supabase via:
   ```ts
   import { cookies } from "next/headers"
   import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
   ```

---

## 6. Seed Initial Data

In `scripts/seed.ts`:
```ts
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  await supabase.from("book").insert([
    { user_id: "user-uuid", title: "1984", author: "George Orwell", status: "read", rating: 5, notes: "Classic dystopia" },
    // ... more seeds
  ])
  console.log("Seeding complete")
}

seed()
```

Add to `package.json`:
```json
"scripts": {
  "seed": "ts-node scripts/seed.ts"
}
```

---

## 7. GitHub & Vercel Deployment

1. Initialize Git, commit all files.
2. Create a GitHub repository and push.
3. On Vercel:  
   - Import the GitHub repo.  
   - In Vercel’s Environment Variables settings, copy `.env.local` values.  
   - Use the Supabase integration from Vercel Marketplace to link your project.

---

## 8. RLS & Security

- Ensure your Supabase table `book` has RLS policies:
  - `ALLOW INSERT/SELECT/UPDATE/DELETE WHERE auth.uid() = user_id`.
- Always include `user_id` in inserts/updates to tie data to the authenticated user.

---

**You’re all set!**  
- Run `npm run dev` to test locally.  
- Push and let Vercel deploy automatically.  
- Log in, add, view, update, and delete books securely via Supabase Auth & Database.