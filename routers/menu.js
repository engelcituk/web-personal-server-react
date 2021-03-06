const express = require("express");
const MenuController = require("../controllers/menu"); //controller menu
//midleware para controlar las peticiones por tokens
const mdAuth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/menu", [mdAuth.ensureAuth], MenuController.addMenu); //add new menu
api.get("/menu", MenuController.getMenus); //get menus
api.put("/menu/:id", [mdAuth.ensureAuth], MenuController.updateMenu); //update menu
api.put("/activate-menu/:id", [mdAuth.ensureAuth], MenuController.activateMenu); //update menu
api.delete("/menu/:id", [mdAuth.ensureAuth], MenuController.deleteMenu); //update menu


module.exports = api;