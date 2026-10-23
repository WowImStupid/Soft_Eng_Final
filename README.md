# Next.js + Supabase Todo App

App Router, Supabase SSR auth (email/password + Google/GitHub OAuth), RLS-protected `todos` table, Server Actions for all mutations, middleware-protected `/dashboard`.

## 1. Supabase
1. Create a project at supabase.com.
2. SQL Editor -> paste and run `supabase/schema.sql` (creates table, enables RLS, adds SELECT/INSERT/UPDATE/DELETE policies on `auth.uid() = user_id`).
3. Authentication -> Providers: Email is on by default. Enable **GitHub** (or Google) and paste the client ID/secret.
   - GitHub: github.com/settings/developers -> New OAuth App. Authorization callback URL = `https://<project-ref>.supabase.co/auth/v1/callback`.
   - Google: Google Cloud Console -> OAuth client (Web). Same Supabase callback URL as the authorized redirect URI.
4. Project Settings -> API: copy the Project URL and anon key.

## 2. Run locally
```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev
```
Local Supabase redirect: Authentication -> URL Configuration -> add `http://localhost:3000/auth/callback` to Redirect URLs.

## 3. Deploy
```bash
git init && git add . && git commit -m "Initial commit"
gh repo create supabase-todo --public --source=. --push   # or create on github.com and push
```
Then on vercel.com: Add New -> Project -> import the repo -> set env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` = your Vercel URL (optional)

Deploy, then in Supabase -> Authentication -> URL Configuration:
- **Site URL**: `https://<your-app>.vercel.app`
- **Redirect URLs**: add `https://<your-app>.vercel.app/auth/callback` (and `http://localhost:3000/auth/callback` for dev)

## Verify isolation
Sign up two users; each sees only their own todos. In the SQL editor, `select * from todos` as the anon role returns nothing.
