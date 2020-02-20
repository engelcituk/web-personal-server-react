const jwt = require("../services/jwt")
const Menu = require("../models/menu"); //modelo


function addMenu(req, res) {
    const user = new Menu();
    console.log('add menu');
}



module.exports = {
    addMenu,
};