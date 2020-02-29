const jwt = require("../services/jwt")
const Post = require("../models/menu"); //modelo


function addPost(req, res) {
    console.log('todo funciona correcto')
    /* const { title, url, order, active } = req.body;
    const menu = new Post();

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
    }) */
}

function getPosts(req, res) {
    Post.find()
        .sort({ order: "asc" })
        .exec((err, posts) => {
            if (err) {
                res.status(500).send({ ok: false, message: "Error de servidor" })
            } else {
                if (!posts) {
                    res.status(404).send({ ok: false, message: "No se ha encontrado ningun menú" });
                } else {
                    res.status(200).send({ ok: true, message: "Menús encontrados", posts });
                }
            }
        });
}

function updatePost(req, res) {
    let postData = req.body;
    const params = req.params;

    Post.findByIdAndUpdate(params.id, postData, (err, postUpdate) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor" })
        } else {
            if (!postUpdate) {
                res.status(404).send({ ok: false, message: "No se ha encontrado el menú" });
            } else {
                res.status(200).send({ ok: true, message: "Menú actualizado correctamente", postUpdate });
            }
        }
    });
}

function activatePost(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    Post.findByIdAndUpdate(id, { active }, (err, postStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor" })
        } else {
            if (!postStored) {
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

function deletePost(req, res) {
    const { id } = req.params;

    Post.findByIdAndRemove(id, (err, postBorrado) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor" });
        } else {
            if (!postBorrado) {
                res.status(404).send({ ok: false, message: "El menú a borrar no se ha encontrado" });
            } else {
                res.status(200).send({ ok: true, message: "Menú borrado correctamente" });
            }
        }
    })
}
module.exports = {
    addPost,
    getPosts,
    updatePost,
    activatePost,
    deletePost
};