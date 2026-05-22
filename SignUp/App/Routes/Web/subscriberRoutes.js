const express = require("express");
const { subscribeEmail } = require("../Controller/Web/subscriberController.js"); // Path confirm kar lein

const subscriberRouter = express.Router();

// Endpoint: POST http://localhost:8030/api/subscribe
subscriberRouter.post("/subscribe", subscribeEmail);

module.exports = subscriberRouter;