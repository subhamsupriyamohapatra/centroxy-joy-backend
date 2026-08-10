const { getIO } = require("../config/socket");

function registerDisplaySocketEvents(socket) {
  console.log(`[DisplaySocket] Registered socket listener for ${socket.id}`);

  socket.on("request-display-refresh", () => {
    const io = getIO();
    io.emit("display-updated", { timestamp: new Date().toISOString() });
  });
}

module.exports = registerDisplaySocketEvents;
