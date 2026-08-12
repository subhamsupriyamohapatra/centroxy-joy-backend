const { put } = require("@vercel/blob");
const env = require("../config/env");

async function uploadFile(file) {
  if (!file) return null;

  if (env.nodeEnv === "production") {
    if (!env.blobToken) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
    }
    const blob = await put(file.originalname, file.buffer, {
      access: "public",
      token: env.blobToken,
      addRandomSuffix: true,
    });
    return blob.url;
  }

  return `/uploads/${file.filename}`;
}

module.exports = { uploadFile };
