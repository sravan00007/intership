import Employee from '../models/Employee.js';
import { sendResponse } from '../utils/apiResponse.js';

// CREATE Employee
export const createEmployee = async (req, res) => {
    try {
        const { empId, name, email, department, designation } = req.body;
        
        const existingEmp = await Employee.findOne({ $or: [{ empId }, { email }] });
        if (existingEmp) {
            return sendResponse(res, 400, false, "Registration failed: Employee ID or Email already exists.");
        }

        const newEmployee = new Employee({ empId, name, email, department, designation });
        await newEmployee.save();

        return sendResponse(
            res, 201, true, 
            `Employee '${name}' successfully onboarded to the ${department} department.`, 
            newEmployee
        );
    } catch (error) {
        return sendResponse(res, 500, false, "Internal server error during employee creation.", null, error.message);
    }
};

// GET All Employees
export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        return sendResponse(res, 200, true, `Successfully fetched all ${employees.length} employee records.`, employees);
    } catch (error) {
        return sendResponse(res, 500, false, "Failed to retrieve employee database records.", null, error.message);
    }
};

// DELETE Employee
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndDelete(id);
        
        if (!employee) {
            return sendResponse(res, 404, false, `Deletion failed: No employee record found matching ID reference.`);
        }

        return sendResponse(res, 200, true, `Employee '${employee.name}' (ID: ${employee.empId}) has been successfully offboarded.`);
    } catch (error) {
        return sendResponse(res, 500, false, "Internal error processing offboarding request.", null, error.message);
    }
};