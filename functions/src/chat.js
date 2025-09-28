// functions/src/chat.js
const { onCall } = require("firebase-functions/v2/httpsİ");
const logger = require("firebase-functions/logger");

/**
 * The main 'chat' callable function.
 * Enforces App Check for security.
 */
exports.chat = onCall({ enforceAppCheck: true }, (request) => {
  if (request.app) {
    logger.info(`Request verified with App Check token for app: ${request.app.appId}`);
  }

  // Your chat-related logic (e.g., calling a GenAI model) would go here.
  const userMessage = request.data.message || "No message provided.";
  
  return {
    status: "success",
    reply: `The chat function received your message: "${userMessage}"`,
  };
});
