// Dummy Data
let students = [
 { id: 1, name: "Rahul", email: "rahul@gmail.com", department: "CSE" }
];
// GET All Students
exports.getStudents = (req, res) => {
 res.status(200).json({ success: true, data: students });
};
// GET Student by ID
exports.getStudentById = (req, res) => {
 const id = parseInt(req.params.id);
 const student = students.find(s => s.id === id);
 if (!student) {
 return res.status(404).json({ success: false, message: "Student Not Found" });
 }
 res.json({ success: true, data: student });
};
// POST Student
exports.createStudent = (req, res) => {
 const student = { id: students.length + 1, ...req.body };
 students.push(student);
 res.status(201).json({ success: true, message: "Student Created", data: student });
};
// PUT Student
exports.updateStudent = (req, res) => {
 const id = parseInt(req.params.id);
 const student = students.find(s => s.id === id);
 if (!student) {
 return res.status(404).json({ success: false, message: "Student Not Found" });
 }
 student.name = req.body.name;
 student.email = req.body.email;
 student.department = req.body.department;
 res.json({ success: true, message: "Student Updated", data: student });
};
// DELETE Student
exports.deleteStudent = (req, res) => {
 const id = parseInt(req.params.id);
 students = students.filter(s => s.id !== id);
 res.json({ success: true, message: "Student Deleted" });
};
