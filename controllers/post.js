const jwt = require("../services/jwt")
const Post = require("../models/post"); //modelo


function addPost(req, res) {

    const body = req.body;
    const post = new Post(body);

    post.save((err, postCreado) => {
        if (err) {
            res.status(500).send({ ok: false, code:500, message: "Error de servidor" })
        } else {
            if (!postCreado) {
                res.status(404).send({ ok: false, code:404, message: "Error al crear el post" })
            } else {
                res.status(200).send({ ok: true, code:200, message: "Post creado correctamente", post: postCreado })
            }
        }
    })
}

function getPosts(req, res) {
    Post.find()
        .sort({ order: "asc" })
        .exec((err, posts) => {
            if (err) {
                res.status(500).send({ ok: false, message: "Error de servidor" })
            } else {
                if (!posts) {
                    res.status(404).send({ ok: false, message: "No se ha encontrado ningun post" });
                } else {
                    res.status(200).send({ ok: true, message: "Posts encontrados", posts });
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
                res.status(404).send({ ok: false, message: "No se ha encontrado el post" });
            } else {
                res.status(200).send({ ok: true, message: "Post actualizado correctamente", postUpdate });
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
                res.status(404).send({ ok: false, message: "No se ha encontrado el post" });
            } else {
                if (active === true) {
                    res.status(200).send({ ok: true, message: "Post activado correctamente" });
                } else {
                    res.status(200).send({ ok: true, message: "Post desactivado correctamente" });
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
                res.status(404).send({ ok: false, message: "El post a borrar no se ha encontrado" });
            } else {
                res.status(200).send({ ok: true, message: "Post borrado correctamente" });
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