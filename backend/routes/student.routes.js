const express = require("express");
const router = express.Router();
const studentController = require("../controller/student.controller");
// GET All Students
router.get("/", studentController.getStudents);
// GET Student By ID
router.get("/:id", studentController.getStudentById);
// CREATE Student
router.post("/", studentController.createStudent);
// UPDATE Student
router.put("/:id", studentController.updateStudent);
// DELETE Student
router.delete("/:id", studentController.deleteStudent);
module.exports = router