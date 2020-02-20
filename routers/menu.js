const express = require("express");
const MenuController = require("../controllers/menu"); //controller menu
//midleware para controlar las peticiones por tokens
const mdAuth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/menu", [mdAuth.ensureAuth], MenuController.addMenu); //add new menu
api.get("/menu", [mdAuth.ensureAuth], MenuController.getMenus); //get menus



module.exports = api;