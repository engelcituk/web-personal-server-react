const jwt = require('../services/jwt');
const moment = require('moment');
const User = require('../models/user');

function willExpireToken(token) {
    const { exp } = jwt.decodedToken(token);
    const currentDay = moment().unix();

    if (currentDay > exp) {
        return true;
    }
    return false;
}

function refreshAccessToken(req, res) {
    const { refreshToken } = req.body;
    const isTokenExpired = willExpireToken(refreshToken);

    if (isTokenExpired) {
        res.status(404).send({ ok: false, message: "El refreshToken ha expirado" });
    } else {
        const { id } = jwt.decodedToken(refreshToken); // se obtiene el id del user, codificado en el refreshToken
        User.findOne({ _id: id }, (err, userStored) => {
            if (err) {
                res.status(500).send({ ok: false, message: "Error en el servidor" });
            } else {
                if (!userStored) {
                    res.status(404).send({ ok: false, message: "Usuario no encontrado" });
                } else {
                    res.status(200).send({
                        ok: true,
                        message: "Usuario encontrado, se genera nuevo access token",
                        accessToken: jwt.createAccessToken(userStored),
                        refreshToken: refreshToken
                    });
                }
            }
        })
    }


}

module.exports = {
    refreshAccessToken
};