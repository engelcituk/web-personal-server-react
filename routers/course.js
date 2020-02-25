const express = require("express");
const CourseController = require("../controllers/course"); //controller course
//midleware para controlar las peticiones por tokens
const mdAuth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/course", [mdAuth.ensureAuth], CourseController.addCourse); //add new course
api.get("/course", CourseController.getCourses); //get all courses



module.exports = api;