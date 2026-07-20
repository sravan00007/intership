
require("dotenv").config();
const express = require("express");
const studentRoutes = require("./routes/student.routes");
const app = express();
app.use(express.json());
app.use("/api/students", studentRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});