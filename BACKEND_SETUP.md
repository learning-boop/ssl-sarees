# SSL Sarees — Backend Added (Node/Express + MongoDB)

## What's new

A real backend now lives in `server/` — Node + Express + TypeScript + MongoDB (via Mongoose). It adds:

- **User login/signup** — `/login`, `/register` pages (already existed in the frontend, now actually work)
- **Admin login** — same login form; if the account's role is `admin`, they get access to `/admin`
- **Product management** — the `/admin` dashboard lets an admin add, edit, and delete sarees. Changes show up immediately on Home, Collections, and Product Details, because those pages now fetch live data from the API instead of the static `src/data/products.ts` file.

## How it fits together

```
ssl-sarees/          (your existing frontend — unchanged structure)
├── src/
│   ├── data/products.ts       (kept as a fallback + seed source, no longer the live source)
│   ├── hooks/useProducts.ts   (NEW — fetches products from the API)
│   ├── pages/admin/AdminDashboard.tsx  (NEW — product CRUD UI)
│   ├── lib/api.ts             (already existed — talks to the backend)
│   ├── context/AuthContext.tsx (already existed)
│   ├── pages/Login.tsx, Register.tsx (already existed, now wired into App.tsx)
│   └── components/ProtectedRoute.tsx (already existed, used to guard /admin)
└── server/            (NEW — the actual backend)
    ├── src/
    │   ├── index.ts             (Express app, connects to MongoDB on startup)
    │   ├── db.ts                (Mongoose connection helper)
    │   ├── models/User.ts       (Mongoose schema — name, email, password hash, role)
    │   ├── models/Product.ts    (Mongoose schema — matches the frontend's Product type)
    │   ├── routes/auth.ts       (register, login, me)
    │   ├── routes/products.ts   (public GET, admin-only POST/PUT/DELETE)
    │   ├── middleware/auth.ts   (JWT check + admin check)
    │   └── seed.ts              (creates the first admin + imports your existing product catalog)
```

## Step 1 — Get a MongoDB database (free, ~5 minutes)

The easiest option is **MongoDB Atlas** (a free hosted MongoDB, no install needed):

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account
2. Create a free **M0 cluster** (no credit card needed)
3. Under **Database Access**, create a database user with a username/password
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) — fine for development
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```
6. Add your database name to the end: `.../ssl-sarees?retryWrites=true&w=majority`

(Alternatively, if you'd rather run MongoDB locally, install "MongoDB Community Server" and use `mongodb://localhost:27017/ssl-sarees` instead — no Atlas account needed, but you have to keep it running on your machine.)

## Step 2 — Run the backend

```bash
cd server
cp .env.example .env
```

Open `.env` and paste your MongoDB connection string into `MONGODB_URI`. Then:

```bash
npm install
npm run seed     # creates the admin account + imports your products into MongoDB
npm run dev      # starts the API on http://localhost:5000
```

Your first admin login (change these in `.env` before seeding on a real deployment):
- Email: `admin@sslsarees.com`
- Password: `ChangeMe123!`

## Step 3 — Run the frontend

In the project root (not `server/`), create a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

Then run as usual:

```bash
npm install
npm run dev
```

Go to `/login`, sign in with the admin account above, then open the account menu (top right) → **Admin Dashboard**, or visit `/admin` directly.

## Viewing your data

MongoDB Atlas has a built-in data browser: in the Atlas dashboard, click **Browse Collections** on your cluster to see the `users` and `products` collections directly, no extra tools needed.

## Deploying later

- **Frontend** stays on Vercel as-is
- **Backend** needs to run somewhere that keeps a Node process alive — Render, Railway, or Fly.io all have free/cheap tiers and work well with Express + MongoDB Atlas
- Point your deployed frontend's `VITE_API_URL` at wherever the backend ends up running
- Atlas works from anywhere once Network Access is open (or you can restrict it to your backend host's IP for tighter security)

## Security notes

- Passwords are hashed with bcrypt, never stored in plain text
- New signups are always created as regular `user` accounts — the register endpoint can never create an admin. Admins are created only via the seed script.
- Product create/edit/delete routes require a valid JWT belonging to an admin account
- Change `JWT_SECRET` and `ADMIN_PASSWORD` before deploying anywhere real, and restrict Atlas Network Access to your real server's IP once you know it
