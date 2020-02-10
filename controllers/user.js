const bcrypt = require("bcrypt-nodejs");
//const jwt = require("")
const User = require("../models/user");

function signUp(req, res) {
    const user = new User();

    const { email, password, repeatPassword } = req.body;
    user.email = email;
    user.role = "admin";
    user.active = false;

    if (!password || !repeatPassword) {
        res.status(404).send({ message: "Las contraseñas son obligatorias" })
    } else {
        if (password !== repeatPassword) {
            res.status(404).send({ message: "Las contraseñas tienen que ser iguales" })
        } else {
            bcrypt.hash(password, null, null, function(err, hash) {

                })
                //res.status(200).send({ message: "Usuario creado" })
        }
    }




}

module.exports = {
    signUp
};