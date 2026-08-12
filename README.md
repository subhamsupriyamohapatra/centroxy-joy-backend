# Centroxy Joy Portal - Backend API

Production-ready Express.js & PostgreSQL backend for **Centroxy Joy Portal**, built with Clean Architecture, MVC pattern, JWT Security, Socket.IO real-time updates, and Zoho integration.

---

## 1. Tech Stack

- **Node.js & Express.js**
- **PostgreSQL & Sequelize** (ORM, auto table sync)
- **JWT & bcryptjs** (Single Admin authentication)
- **Multer + Vercel Blob** (Image uploads; local `/uploads` in development)
- **Socket.IO** (Real-time `display-updated` broadcast)
- **Vercel Cron** (Daily 08:00 AM Zoho birthday sync)
- **Express-Validator** (Input validation)
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

# Vercel Cron protection (secret sent in Authorization header by Vercel Cron)
CRON_SECRET=your_cron_secret

ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_ORG_ID=your_zoho_org_id
```

---

## 3. Running the Backend

### Installation
```bash
cd backend
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

The backend starts at `http://localhost:5002/api`.

> **Note:** On startup the app authenticates with PostgreSQL, auto-creates missing tables (`sequelize.sync`), and seeds a default Admin user and portal Settings.

---

## 4. API Reference

### Health
- `GET /health` -> Returns service health status

### Auth
- `POST /api/auth/login` (Body: `username`, `password`) -> Returns JWT token
- `POST /api/auth/logout` -> Clears cookie
- `GET /api/auth/me` -> Gets Admin profile

### Public Display & Dashboard
- `GET /api/display` -> Aggregates all published slides ordered by sequence for digital kiosk
- `GET /api/dashboard` -> Summary metrics, today's birthdays, thought of the day, upcoming events, and activity logs

### Modules (CRUD + Pagination + Search + Status + Image Upload)
- **Thoughts**: `GET/POST /api/thoughts`, `GET/PUT/DELETE /api/thoughts/:id`
- **Birthdays**: `GET/POST /api/birthdays`, `GET/PUT/DELETE /api/birthdays/:id`
- **Employees of Month**: `GET/POST /api/employees`, `GET/PUT/DELETE /api/employees/:id`
- **New Customers**: `GET/POST /api/customers`, `GET/PUT/DELETE /api/customers/:id`
- **Announcements**: `GET/POST /api/announcements`, `GET/PUT/DELETE /api/announcements/:id`
- **Upcoming Events**: `GET/POST /api/events`, `GET/PUT/DELETE /api/events/:id`
- **Participation**: `GET/POST /api/participation`, `GET/PUT/DELETE /api/participation/:id`
- **Industry News**: `GET/POST /api/news`, `GET/PUT/DELETE /api/news/:id`

### Settings & Zoho
- `GET /api/settings`, `PUT /api/settings`
- `POST /api/zoho/sync` -> Manually triggers Zoho birthday sync
- `POST /api/zoho/cron` -> Cron endpoint (Vercel Cron runs daily at 08:00, protected by `CRON_SECRET`)
