const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_KEY = "LGKU23T7fgs7668JSJVrfK4YHDldjdfRR78NOPZCBRg";

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ ok: false, message: "La petición no tiene cabecera de autenticación" })
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        var payload = jwt.decode(token, SECRET_KEY);
        if (payload.exp <= moment.unix()) {
            return res.status(404).send({ ok: false, message: "El token ha expirado" })
        }
    } catch (error) {
        return res.status(404).send({ ok: false, message: "Token invalido" })
    }

    req.user = payload;
    next()
}