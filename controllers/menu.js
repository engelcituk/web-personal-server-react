const jwt = require("../services/jwt")
const Menu = require("../models/menu"); //modelo


function addMenu(req, res) {
    const { title, url, order, active } = req.body;
    const menu = new Menu();

    menu.title = title;
    menu.url = url;
    menu.order = order;
    menu.active = active;

    menu.save((err, menuCreado) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error de servidor" })
        } else {
            if (!menuCreado) {
                res.status(404).send({ ok: false, message: "Error al crear el menú" })
            } else {
                res.status(200).send({ ok: true, message: "Menú creado correctamente", menu: menuCreado })
            }
        }
    })
}



module.exports = {
    addMenu,
};