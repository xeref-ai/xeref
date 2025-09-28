// functions/index.js

const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK once
admin.initializeApp();

// Export the core 'app' and 'chat' functions
const { app } = require('./src/app');
const { chat } = require('./src/chat');

exports.app = app;
exports.chat = chat;
