const Newsletter = require("../models/newsletter"); //modelo


function suscribeEmail(req, res) {
    
    const email = req.params.email;
    const newsletter = new Newsletter();

    if(!email){
        res.status(404).send({ ok: false, code: 404, message: "El email es obligatorio"})
    }else {
        newsletter.email = email.toLowerCase();
        newsletter.save((err, suscribeEmailCreado) => {
            if (err) {
                res.status(500).send({ ok: false, code: 500, message: "Email ya existe" })
            } else {
                if (!suscribeEmailCreado) {
                    res.status(404).send({ ok: false, code: 404, message: "Error al hacer la suscripción" })
                } else {
                    res.status(200).send({ ok: true, code: 200, message: "Suscripción realizado correctamente", newsletter: suscribeEmailCreado })
                }
            }
        })
    }
    
}

module.exports = {
    suscribeEmail
};