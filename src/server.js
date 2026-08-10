const http = require("http");
const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");
const initBirthdayCron = require("./cron/birthdayCron");

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start Server & Connect DB
const PORT = env.port || 5000;

async function startServer() {
  await connectDB();

  // Initialize Cron Scheduler
  initBirthdayCron();

  server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Centroxy Joy Portal Backend Running`);
    console.log(`📍 Environment : ${env.nodeEnv}`);
    console.log(`🌐 API Server  : http://localhost:${PORT}/api`);
    console.log(`⚡ Socket.IO   : http://localhost:${PORT}`);
    console.log(`🔑 Admin Login : Username: ${env.adminUsername} | Password: ${env.adminPassword}`);
    console.log(`==================================================`);
  });
}

startServer();

process.on("unhandledRejection", (err) => {
  console.error("[Unhandled Rejection]", err);
});

process.on("uncaughtException", (err) => {
  console.error("[Uncaught Exception]", err);
});
