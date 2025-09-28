// functions/src/app.js
const { onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

/**
 * The main 'app' callable function.
 * Enforces App Check to ensure requests come from a valid app instance.
 */
exports.app = onCall({ enforceAppCheck: true }, (request) => {
  // Log the App Check token for verification, if available
  if (request.app) {
    logger.info(`Request verified with App Check token for app: ${request.app.appId}`);
  }

  // Your main application logic would go here.
  // For now, we return a simple success message.
  return {
    status: "success",
    message: "Welcome to the Xerefai App function.",
    timestamp: new Date().toISOString(),
  };
});
