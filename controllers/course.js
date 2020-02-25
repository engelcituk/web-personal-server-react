const Course = require("../models/course"); //modelo


function addCourse(req, res) {

    const body = req.body;
    const course = new Course(body);
    course.order= 1000;

    course.save((err, courseCreado) => {
        if (err) {
            res.status(400).send({ ok: false, code:400, message: "El curso ya existe" })
        } else {
            if (!courseCreado) {
                res.status(400).send({ ok: false, code:400, message: "Error, no se pudo crear el curso" })
            } else {
                res.status(200).send({ ok: true, code:200,message: "Curso creado correctamente", course: courseCreado })
            }
        }
    })
}

module.exports = {
    addCourse
};