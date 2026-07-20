require("dotenv").config();

const express = require('express');
const studentRouter=require("./routes/student.routes.js")
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/students",studentRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

