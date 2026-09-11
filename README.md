# Centroxy Joy Portal - Backend API

Production-ready Express.js & PostgreSQL backend for **Centroxy Joy Portal**, built with Clean Architecture, MVC pattern, JWT Security, Socket.IO real-time updates, and Zoho integration.

---

## 1. Tech Stack

- **Node.js & Express.js**
- **PostgreSQL & Sequelize** (ORM, auto table sync)
- **JWT & bcryptjs** (Single Admin authentication)
- **Multer + Vercel Blob** (Image uploads; local `/uploads` in development)
- **Socket.IO** (Real-time `display-updated` broadcast to kiosk clients)
- **Dual Schedulers**: Local `node-cron` + Vercel Cron (Daily 08:00 AM Zoho birthday sync)
- **Express-Validator** (Input validation on POST routes)
- **Security**: Helmet, CORS, Rate Limiting, Cookie-Parser, Compression

---

## 2. Environment Variables (`.env`)

```env
PORT=5002
NODE_ENV=development

# PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/centroxy_joy_portal
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=centroxy_joy_portal
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES=24h

ADMIN_USERNAME=centroxy
ADMIN_PASSWORD=centroxy2026

CLIENT_URL=http://localhost:3000

# Vercel Blob (required for image uploads in production)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_read_write_token

# Cron protection (sent in Authorization Bearer / x-cron-secret header by Vercel Cron)
CRON_SECRET=your_cron_secret

ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_ORG_ID=your_zoho_org_id
```

> **Note:** The code default port is `5000`; `5002` is used only when `PORT=5002` is set in `.env`.

---

## 3. Running the Backend

### Installation
```bash
cd centroxy-joy-backend
npm install
```

### Start Development Server
```bash
npm run dev
```

### Production
```bash
npm start
```

The backend starts at `http://localhost:5002/api` (or `/api/health` to verify).

> **Note:** On startup the app authenticates with PostgreSQL, auto-creates missing tables (`sequelize.sync`), and seeds a default Admin user and portal Settings. In `NODE_ENV=development`, authenticated routes automatically fall back to the default admin when no/invalid JWT is supplied (JWT is strictly enforced in production).

---

## 4. API Reference

> **Auth:** All routes below marked 🔒 require a valid JWT (`Authorization: Bearer <token>` or the `token` httpOnly cookie). In development this is bypassed automatically.

### Health
- `GET /health` -> Returns service health status

### Auth
- `POST /api/auth/login` (Public; Body: `username`, `password`) -> Returns JWT token, sets httpOnly cookie
- `POST /api/auth/logout` 🔒 -> Clears cookie
- `GET /api/auth/me` 🔒 -> Gets Admin profile

### Public Display & Admin Dashboard
- `GET /api/display` (Public) -> Aggregates all published slides for the digital kiosk (Thought -> Birthday -> Employee -> Customer -> Announcement -> Event -> Participation -> News -> Banner; each group ordered by `updatedAt DESC`)
- `GET /api/dashboard` 🔒 -> Summary metrics, latest birthday/thought/event/employee/announcement/news, counts for all 9 modules, and last 10 activity logs

### Modules (CRUD + Pagination + Search + Status + Image Upload)
All modules below use `protectAdmin` and support `page`, `limit`, `search`, and `status` query params. Image upload via `multipart/form-data` with `image` field (`upload.single("image")`), 5MB max, formats: jpg/jpeg/png/gif/webp/svg.

- **Thoughts**: `GET/POST /api/thoughts`, `GET/PUT/DELETE /api/thoughts/:id` (search: title/quote/author)
- **Birthdays**: `GET/POST /api/birthdays`, `GET/PUT/DELETE /api/birthdays/:id` (search: employeeName/department/designation)
- **Employees of Month**: `GET/POST /api/employees`, `GET/PUT/DELETE /api/employees/:id` (search: employeeName/achievement/month)
- **New Customers**: `GET/POST /api/customers`, `GET/PUT/DELETE /api/customers/:id` (search: companyName/projectName)
- **Announcements**: `GET/POST /api/announcements`, `GET/PUT/DELETE /api/announcements/:id` (search: title/description)
- **Upcoming Events**: `GET/POST /api/events`, `GET/PUT/DELETE /api/events/:id` (ordered by `date ASC`; search: title/venue/description)
- **Participation**: `GET/POST /api/participation`, `GET/PUT/DELETE /api/participation/:id` (search: employee/competition/achievement)
- **Industry News**: `GET/POST /api/news`, `GET/PUT/DELETE /api/news/:id` (search: headline/description/source)
- **Banners**: `GET/POST /api/banners`, `GET/PUT/DELETE /api/banners/:id` (status filter, no search)

> **Note:** `POST` routes validate input via `express-validator` (all modules except Banner); `PUT` routes skip validation. All create/update/delete operations write an `ActivityLog` and broadcast `display-updated` over Socket.IO.

### Settings
- `GET /api/settings` (Public) -> Returns the single settings row (auto-creates default if none exists)
- `PUT /api/settings` 🔒 -> Updates portal settings; accepts `logo` file upload (`upload.single("logo")`), broadcasts `display-updated`

### Zoho
- `POST /api/zoho/sync` 🔒 -> Manually triggers Zoho birthday sync (broadcasts `display-updated` if records synced)
- `POST /api/zoho/cron` (Protected by `CRON_SECRET`) -> Cron-triggered sync endpoint; authenticates via `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret: <CRON_SECRET>` header (not admin JWT). Vercel Cron also calls it.

---

## 5. Realtime Updates (Socket.IO)

- Kiosk clients listen for `display-updated` broadcast by the server to refresh slides instantly whenever content changes (CRUD, settings, Zoho sync).
- The broadcast payload is `{ timestamp, ...data }`. The frontend kiosk additionally polls `GET /api/display` every 30s as a fallback.

---

## 6. Scheduled Tasks

Two independent mechanisms sync Zoho birthdays daily at 08:00:
1. **Local `node-cron`** — `src/cron/birthdayCron.js` runs within the Node process (both local and Vercel serverless).
2. **Vercel Cron** — `vercel.json` schedules `POST /api/zoho/cron`, protected by `CRON_SECRET`.

---

## 7. Deployment (Vercel)

- **`vercel.json`**: `functions.api/index.js.maxDuration = 60`, cron at `/api/zoho/cron` daily 08:00.
- **`api/index.js`**: Serverless entry that lazily connects the DB once (cached promise), reconnects on failure, then proxies to the Express app.
- **`.vercelignore`**: Excludes `.env`, `src/uploads/`, logs.
- **Local**: `src/server.js` is the entry point (HTTP + Socket.IO + PostgreSQL connect + cron).

---

## 8. Project Structure

```
src/
├── app.js                # Express app (helmet, cors, rate-limit, compression, routes)
├── server.js             # HTTP + Socket.IO + PostgreSQL connect + node-cron
├── api/                  # Vercel serverless entry
├── config/               # env, database, socket
├── controllers/          # 13 controllers (auth, dashboard, 9 modules, settings, zoho)
├── cron/                 # birthdayCron.js (daily 08:00 Zoho sync)
├── middleware/           # protectAdmin, upload, validate, notFound, errorHandler
├── models/               # 12 Sequelize models (Admin, ActivityLog, 9 modules, Setting)
├── routes/               # index.js mounts all route modules
├── services/             # display.service.js, zoho.service.js, blob.service.js
├── sockets/              # displaySocket.js (client request handler)
└── utils/                # asyncHandler, successResponse, logger, etc.
```