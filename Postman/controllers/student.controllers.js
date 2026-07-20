let students = [
    { id: 1, name: "John Doe", age: 20, grade: "A" },
    { id: 2, name: "Jane Smith", age: 21, grade: "B" }
];

const getAllStudents = (req, res) => {
    res.status(200).json(students);
};

const addStudent = (req, res) => {
    const { name, age, grade } = req.body;
    if (!name || !age || !grade) {
        return res.status(400).json({ message: "Name, age, and grade are required" });
    }
    const newStudent = {
        id: students.length > 0 ? students[students.length - 1].id + 1 : 1,
        name,
        age: parseInt(age),
        grade
    };
    students.push(newStudent);
    res.status(201).json({ message: "Student added successfully", student: newStudent });
};

const updateStudent = (req, res) => {
    const { id, name, age, grade } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Student ID is required" });
    }
    const student = students.find(s => s.id === parseInt(id));
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    if (name) student.name = name;
    if (age) student.age = parseInt(age);
    if (grade) student.grade = grade;
    res.status(200).json({ message: "Student updated successfully", student });
};

const deleteStudent = (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Student ID is required" });
    }
    const index = students.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }
    const deletedStudent = students.splice(index, 1);
    res.status(200).json({ message: "Student deleted successfully", student: deletedStudent[0] });
};

module.exports = {
    getAllStudents,
    addStudent,
    updateStudent,
    deleteStudent
};
