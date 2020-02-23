const express = require("express");
const NewsletterController = require("../controllers/newsletter"); //controller newsletter

const api = express.Router();

api.post("/newsletter/:email", NewsletterController.suscribeEmail); //add new suscription

module.exports = api;