# MSc Society — Events Admin Portal

Admin portal for creating, updating, and publishing society events. Built with Next.js (App Router), MongoDB (Mongoose), and deployed on Vercel.

## Tech Stack
- Next.js 16 (App Router, TypeScript)
- MongoDB Atlas via Mongoose
- JWT session cookie (via `jose`), checked in `proxy.ts`
- Zod for validation
- Tailwind CSS v4

## Setup

1. **Install dependencies**
```bash
   npm install
```

2. **Environment variables** — create `.env.local`:
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123

3. **Run locally**
```bash
   npm run dev
```
   - Public events page: `http://localhost:3000/events`
   - Admin login: `http://localhost:3000/admin/login`

4. **Deploy**
   - Push to GitHub, import into Vercel
   - Add the same environment variables in Vercel project settings
   - Deploy
  
5. **Live Link**
   https://admin-portal-delta-blue.vercel.app/admin/login

## Assumptions
- Single admin account, credentials stored in environment variables (per assignment brief allowing dummy credentials).
- Event images are added via a URL field rather than file storage, since Vercel's filesystem is not persistent.
- Public page shows all events sorted by soonest date first, rather than hiding past events.

## Features
- Admin login with protected `/admin/*` routes
- Full CRUD for events (create, read, update, delete)
- Public events page reading live from MongoDB
- Register Now button opening registration link in a new tab
- Fully responsive (mobile, tablet, desktop)
- Search and category filter
- Dark / light mode toggle
- Toast notifications and loading states
