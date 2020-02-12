const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt")
const User = require("../models/user");

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

module.exports = {
    signUp,
    singIn,
    getUsers,
    getUsersActive
};