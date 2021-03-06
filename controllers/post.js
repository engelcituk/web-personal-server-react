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
    const {page = 1, limit = 10}= req.query;

    const options = {
        page,
        limit: parseInt(limit),
        sort: { date: "desc"}
    }

    Post.paginate({},options, (err, posts)=> {
        if (err) {
            res.status(500).send({ ok: false, code:500, message: "Error de servidor" })
        } else {
            if (!posts) {
                res.status(404).send({ ok: false, code:404, message: "No se ha encontrado ningun post" });
            } else {
                res.status(200).send({ ok: true, code:200, message: "Posts encontrados", posts });
            }
        }
    });
}
function getPost(req, res) {
    const {url}=req.params;
    
    // como lo obtenido desde destructuring es la misma variable no es necesario poner finone como url:urlname
    Post.findOne({url}, (err, postStored) =>{
        if (err) {
            res.status(500).send({ ok: false, code:500, message: "Error del servidor" })
        } else {
            if (!postStored) {
                res.status(404).send({ ok: false,code:404,  message: "No se ha encontrado el post" });
            } else {
                res.status(200).send({ ok: true, code:200,  message: "Post encontrado", post: postStored });
            }
        }
    })
}

function updatePost(req, res) {

    let postData = req.body;
    const {id} = req.params;

    Post.findByIdAndUpdate(id, postData, (err, postUpdate) => {
        if (err) {
            res.status(500).send({ ok: false, code:500, message: "Error del servidor" })
        } else {
            if (!postUpdate) {
                res.status(404).send({ ok: false,code:404,  message: "No se ha encontrado el post" });
            } else {
                res.status(200).send({ ok: true, code:200,  message: "Post actualizado correctamente", postUpdate });
            }
        }
    });
}


function deletePost(req, res) {
    const { id } = req.params;

    Post.findByIdAndRemove(id, (err, postBorrado) => {
        if (err) {
            res.status(500).send({ ok: false,  code:500,message: "Error del servidor" });
        } else {
            if (!postBorrado) {
                res.status(404).send({ ok: false,code:404,  message: "El post a borrar no se ha encontrado" });
            } else {
                res.status(200).send({ ok: true, code:200,message: "Post borrado correctamente" });
            }
        }
    })
}
module.exports = {
    addPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
};