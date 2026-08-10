# Centroxy Joy Portal - Backend API

Production-ready Express.js & MongoDB backend for **Centroxy Joy Portal**, built with Clean Architecture, MVC pattern, JWT Security, Socket.IO real-time updates, and Zoho integration.

---

## 1. Tech Stack

- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT & bcryptjs** (Single Admin authentication)
- **Multer** (File & Image uploads to `/uploads`)
- **Socket.IO** (Real-time `display-updated` broadcast)
- **Node-Cron** (Daily 08:00 AM Zoho birthday sync)
- **Express-Validator** (Input validation)
- **Security**: Helmet, CORS, Rate Limiting, Cookie-Parser, Compression

---

## 2. Environment Variables (`.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/centroxy_joy_portal
JWT_SECRET=centroxy_secret_key_2026_super_secure_token_key
JWT_EXPIRES=24h

ADMIN_USERNAME=centroxy
ADMIN_PASSWORD=centroxy2026

CLIENT_URL=http://localhost:3000

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

The backend starts at `http://localhost:5000/api`.

---

## 4. API Reference

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
