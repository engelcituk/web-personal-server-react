const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt")
const User = require("../models/user"); //modelo
const fs = require("fs"); // file system
const path = require("path");

function signUp(req, res) {
    const user = new User();

    const { name, lastname, email, password, repeatPassword } = req.body;
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = "admin";
    user.active = false;

    if (!password || !repeatPassword) {
        res.status(404).send({ ok: false, message: "Las contraseñas son obligatorias" })
    } else {
        if (password !== repeatPassword) {
            res.status(404).send({ ok: false, message: "Las contraseñas tienen que ser iguales" })
        } else {
            bcrypt.hash(password, null, null, function(err, hash) {
                if (err) {
                    res.status(500).send({ ok: false, message: "Error al encriptar la contraseña" })
                } else {
                    user.password = hash;
                    user.save((err, userSaved) => {
                        if (err) {
                            res.status(500).send({ ok: false, message: "Error: el usuario ya existe" + err })
                        } else {
                            if (!userSaved) {
                                res.status(404).send({ ok: false, message: "Error al crear el usuario" })
                            } else {
                                res.status(200).send({ ok: true, user: userSaved })
                            }
                        }
                    });
                }
            })
        }
    }
}

function singIn(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({ email }, (err, userStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor" })
        } else {
            if (!userStored) {
                res.status(404).send({ ok: false, message: "El usuario no encontrador" })
            } else {
                bcrypt.compare(password, userStored.password, (err, check) => {
                    if (err) {
                        res.status(500).send({ ok: false, message: "Error del servidor" });
                    } else if (!check) {
                        res.status(404).send({ ok: false, message: "Error, la contraseña es incorrecta" });
                    } else {
                        if (!userStored.active) {
                            res.status(200).send({ ok: false, message: "Error, el usuario aun no está activado" });
                        } else {
                            res.status(200).send({
                                ok: true,
                                message: "Usuario encontrado",
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefresToken(userStored),
                            });
                        }
                    }
                })
            }
        }
    })
}

function getUsers(req, res) {
    User.find().then(users => {
        if (!users) {
            res.status(404).send({ ok: false, message: "No se ha encontrado ningun usuario" });
        } else {
            res.status(200).send({ ok: true, message: "Usuarios encontrados", users });
        }
    });
}

function getUsersActive(req, res) {
    const query = req.query;

    User.find({ active: query.active }).then(users => {
        if (!users) {
            res.status(404).send({ ok: false, message: "No se ha encontrado ningun usuario" });
        } else {
            res.status(200).send({ ok: true, message: "Usuarios encontrados", users });
        }
    });
}

function uploadAvatar(req, res) {
    const params = req.params;

    User.findById({ _id: params.id }, (err, usuarioDB) => {
        if (err) {
            res.status(404).send({ ok: false, message: "Error en el servidor" });
        } else {
            if (!usuarioDB) {
                res.status(404).send({ ok: false, message: "Usuario no encontrado" });
            } else {
                let user = usuarioDB;
                if (req.files) {
                    let filePath = req.files.avatar.path;
                    let fileSplit = filePath.split("/"); //se le quita los diagonales al path
                    let fileName = fileSplit[2]; // Se obtiene el nombre copleto de la img en la ruta /uploads/avatar/kafkjaffd.jpg ->posicion 3, osea 2
                    let extSplit = fileName.split("."); // el nombre de la img al hacerle split genera un array de dos posiciones
                    let fileExt = extSplit[1]; // se toma la extension, que ocupa la posicion 2 o -> [1]
                    if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg") {
                        res.status(404).send({ ok: false, message: "La extension de la imagen no es valida, se permiten: png y jpg" });
                    } else {
                        user.avatar = fileName;
                        User.findByIdAndUpdate({ _id: params.id }, user, (err, userGuardado) => {
                            if (err) {
                                res.status(500).send({ ok: false, message: "Error del servidor" });
                            } else {
                                if (!userGuardado) {
                                    res.status(404).send({ ok: false, message: "Usuario no encontrado para actualizar" });
                                } else {
                                    res.status(200).send({ ok: true, message: "Usuario actualizado", avatarName: fileName });
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}

function getAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/" + avatarName;

    fs.exists(filePath, exists => {
        if (!exists) {
            res.status(404).send({ ok: false, message: "El avatar que buscas no existe" });
        } else {
            res.sendFile(path.resolve(filePath));
        }
    })
}

async function updateUser(req, res) {
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params;

    if (userData.password) {
        await bcrypt.hash(userData.password, null, null, (err, hash) => {
            if (err) {
                res.status(500).send({ ok: false, message: "Error al encriptar la contraseña" });
            } else {
                userData.password = hash;
            }
        });
    }

    User.findByIdAndUpdate({ _id: params.id }, userData, (err, userActualizado) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor" });
        } else {
            if (!userActualizado) {
                res.status(404).send({ ok: false, message: "El usuario a actualizar no existe" });
            } else {
                res.status(200).send({ ok: true, message: "Usuario actualizado", usuario: userActualizado });
            }
        }
    })
}

function activateUser(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    User.findByIdAndUpdate(id, { active }, (err, userGuardado) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor" });
        } else {
            if (!userGuardado) {
                res.status(404).send({ ok: false, message: "El usuario a activar no se ha encontrado" });
            } else {
                if (active === true) {
                    res.status(200).send({ ok: true, message: "Usuario activado correctamente", usuario: userGuardado });
                } else {
                    res.status(200).send({ ok: true, message: "Usuario desactivado correctamente", usuario: userGuardado });
                }
            }
        }
    })
}

function deleteUser(req, res) {
    const { id } = req.params;

    User.findByIdAndRemove(id, (err, userBorrado) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor" });
        } else {
            if (!userBorrado) {
                res.status(404).send({ ok: false, message: "El usuario a borrar no se ha encontrado" });
            } else {
                res.status(200).send({ ok: true, message: "Usuario borrado correctamente" });
            }
        }
    })
}

function signUpAdmin(req, res) {
    const user = new User();

    const { name, lastname, email, role, password } = req.body;
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = role;
    user.active = true;

    if (!password) {
        res.status(500).send({ ok: false, message: "La contraseña es obligatoria" });
    } else {
        bcrypt.hash(password, null, null, (err, hash) => {
            if (err) {
                res.status(500).send({ ok: false, message: "Error al encriptar la contraseña" });
            } else {
                user.password = hash;
                user.save((err, usuarioGuardado) => {
                    if (err) {
                        res.status(500).send({ ok: false, message: "El usuario ya existe" });
                    } else {
                        if (!usuarioGuardado) {
                            res.status(500).send({ ok: false, message: "Error al crear el nuevo usuario." });
                        } else {
                            res.status(200).send({ ok: true, message: "Usuario creado.", usuario: usuarioGuardado });
                        }
                    }
                })
            }
        });
    }
}

module.exports = {
    signUp,
    singIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    signUpAdmin
};