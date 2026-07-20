const express=require('express');
const router=express.Router();
const studentController=require("../controllers/student.controllers.js")
router.get("/getStudent",studentController.getAllStudents)
router.post("/addStudent",studentController.addStudent)
router.post("/updateStudent",studentController.updateStudent)
router.delete("/deleteStudent",studentController.deleteStudent)
module.exports=router;