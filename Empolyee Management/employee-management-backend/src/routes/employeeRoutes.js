import express from 'express';
import { createEmployee, getAllEmployees, deleteEmployee } from '../controllers/employeeController.js';

const router = express.Router();

router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.delete('/:id', deleteEmployee);

export default router;