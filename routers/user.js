const express = require("express");
const UserController = require("../controllers/user");
const mdAuth = require("../middlewares/authenticated");
const api = express.Router();

api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.singIn);
api.get("/users", [mdAuth.ensureAuth], UserController.getUsers);

module.exports = api;