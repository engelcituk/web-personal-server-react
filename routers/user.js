const express = require("express");
const UserController = require("../controllers/user");
const multipart = require("connect-multiparty");
//midleware para controlar las peticiones por tokens
const mdAuth = require("../middlewares/authenticated");
//midleware para gestionar la subida de archivos
const mdUploadAvatar = multipart({ uploadDir: "./uploads/avatar" });

const api = express.Router();

api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.singIn);
api.get("/users", [mdAuth.ensureAuth], UserController.getUsers);
api.get("/users-active", [mdAuth.ensureAuth], UserController.getUsersActive);
api.put("/upload-avatar/:id", [mdAuth.ensureAuth, mdUploadAvatar], UserController.uploadAvatar);
api.get("/get-avatar/:avatarName", UserController.getAvatar);
api.put("/users/:id", [mdAuth.ensureAuth], UserController.updateUser);


module.exports = api;