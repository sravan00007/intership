router.js
 
const express = require('express');
const router = express.Router()
 
 
const studentController = require('../controller/student.controller')
 
 
router.get("/", studentController.getStudents);
router.post("/addStudent", studentController.addStudent);
router.put("/updateStudent/:id", studentController.updateStudent);
router.delete("/deleteStudent/:id", studentController.deleteStudent);
 
module.exports = router;
 

 
exports.getStudents = (req, res) => {
    res.json({ message: "All Students" });
};
exports.addStudent = (req, res) => {
    res.status(201).json({ message: "Student Added Successfully", student: req.body });
};
exports.updateStudent = (req, res) => {
    res.json({ message: "Student Updated", studentId: req.params.id });
};
exports.deleteStudent = (req, res) => {
    res.json({ message: "Student Deleted", studentId: req.params.id });
};
 