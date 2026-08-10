const { Server } = require("socket.io");

let io = null;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
}

function emitDisplayUpdated(data = {}) {
  if (io) {
    io.emit("display-updated", {
      timestamp: new Date().toISOString(),
      ...data,
    });
    console.log("[Socket.IO] Broadcasted event: display-updated");
  }
}

module.exports = {
  initSocket,
  getIO,
  emitDisplayUpdated,
};
