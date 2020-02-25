const Course = require("../models/course"); //modelo


function addCourse(req, res) {

    const body = req.body;
    const course = new Course(body);
    course.order= 1000;

    course.save((err, courseCreado) => {
        if (err) {
            res.status(500).send({ ok: false, code:500, message: "Error en el servidor" })
        } else {
            if (!courseCreado) {
                res.status(400).send({ ok: false, code:400, message: "Error, no se pudo crear el curso" })
            } else {
                res.status(200).send({ ok: true, code:200,message: "Curso creado correctamente", course: courseCreado })
            }
        }
    })
}
function getCourses(req, res) {
    Course.find()
        .sort({ order: "asc" })
        .exec((err, courses) => {
            if (err) {
                res.status(500).send({ ok: false, code:500, message: "Error de servidor" })
            } else {
                if (!courses) {
                    res.status(404).send({ ok: false, code:404, message: "No se ha encontrado ningun curso" });
                } else {
                    res.status(200).send({ ok: true, code:200, message: "Cursos encontrados", courses });
                }
            }
        });
}

module.exports = {
    addCourse,
    getCourses
};