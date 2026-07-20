import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Main Routing mount point
app.use('/api/employees', employeeRoutes);

export default app;