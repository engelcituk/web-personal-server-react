const bcrypt = require("bcrypt-nodejs");
//const jwt = require("")
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

module.exports = {
    signUp
};