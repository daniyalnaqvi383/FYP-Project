const express = require("express");
const { handleBotChat } = require("../../Controller/Web/chatController.js");

const chatRouter = express.Router();

// Endpoint: POST http://localhost:8030/api/chat
chatRouter.post("/chat", handleBotChat);

module.exports = chatRouter;