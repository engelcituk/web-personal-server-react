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
function deleteCourse(req, res) {
    const { id } = req.params;

    Course.findByIdAndRemove(id, (err, courseBorrado) => {
        if (err) {
            res.status(500).send({ ok: false, code:500, message: "Error del servidor" });
        } else {
            if (!courseBorrado) {
                res.status(404).send({ ok: false, code:404, message: "El curso a borrar no se ha encontrado" });
            } else {
                res.status(200).send({ ok: true, code:200, message: "Curso borrado correctamente" });
            }
        }
    })
}

function updateCourse(req, res) {
    let courseData = req.body;
    const { id } = req.params;

    Course.findByIdAndUpdate(id, courseData, (err, cursoActualizado) => {
        if (err) {
            res.status(500).send({ ok: false, code:500, message: "Error del servidor" })
        } else {
            if (!cursoActualizado) {
                res.status(404).send({ ok: false, code:404, message: "No se ha encontrado el menú" });
            } else {
                res.status(200).send({ ok: true, code:200, message: "Curso actualizado correctamente", cursoActualizado });
            }
        }
    });
}

module.exports = {
    addCourse,
    getCourses,
    deleteCourse,
    updateCourse
};