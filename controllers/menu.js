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

function getMenus(req, res) {
    Menu.find()
        .sort({ order: "asc" })
        .exec((err, menus) => {
            if (err) {
                res.status(500).send({ ok: false, message: "Error de servidor" })
            } else {
                if (!menus) {
                    res.status(404).send({ ok: false, message: "No se ha encontrado ningun menú" });
                } else {
                    res.status(200).send({ ok: true, message: "Usuarios encontrados", menus });
                }
            }
        });
}

function updateMenu(req, res) {
    let menuData = req.body;
    const params = req.params;

    Menu.findByIdAndUpdate(params.id, menuData, (err, menuUpdate) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor" })
        } else {
            if (!menuUpdate) {
                res.status(404).send({ ok: false, message: "No se ha encontrado el menú" });
            } else {
                res.status(200).send({ ok: true, message: "Menú actualizado correctamente", menuUpdate });
            }
        }
    });
}

function activateMenu(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    Menu.findByIdAndUpdate(id, { active }, (err, menuStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor" })
        } else {
            if (!menuStored) {
                res.status(404).send({ ok: false, message: "No se ha encontrado el menú" });
            } else {
                if (active === true) {
                    res.status(200).send({ ok: true, message: "Menú activado correctamente" });
                } else {
                    res.status(200).send({ ok: true, message: "Menú desactivado correctamente" });
                }
            }
        }
    });
}

function deleteMenu(req, res) {
    const { id } = req.params;

    Menu.findByIdAndRemove(id, (err, menuBorrado) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor" });
        } else {
            if (!menuBorrado) {
                res.status(404).send({ ok: false, message: "El menú a borrar no se ha encontrado" });
            } else {
                res.status(200).send({ ok: true, message: "Menú borrado correctamente" });
            }
        }
    })
}
module.exports = {
    addMenu,
    getMenus,
    updateMenu,
    activateMenu,
    deleteMenu
};