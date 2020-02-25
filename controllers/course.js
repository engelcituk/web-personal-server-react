const Course = require("../models/course"); //modelo


function addCourse(req, res) {

    console.log('hola');
    /* const user = new Course();

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
    } */
}

module.exports = {
    addCourse
};