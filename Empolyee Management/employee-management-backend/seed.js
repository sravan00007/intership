import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './src/models/Employee.js';

dotenv.config();

const mockEmployees = [
  {
    empId: 'EMP001',
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    department: 'Engineering',
    designation: 'Senior Software Engineer'
  },
  {
    empId: 'EMP002',
    name: 'Bob Jones',
    email: 'bob.jones@example.com',
    department: 'Product',
    designation: 'Product Manager'
  },
  {
    empId: 'EMP003',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    department: 'Design',
    designation: 'UI/UX Designer'
  },
  {
    empId: 'EMP004',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    department: 'Engineering',
    designation: 'QA Engineer'
  },
  {
    empId: 'EMP005',
    name: 'Ethan Hunt',
    email: 'ethan.hunt@example.com',
    department: 'Operations',
    designation: 'DevOps Specialist'
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected.');

    // Clear existing data
    console.log('Clearing existing employee records...');
    await Employee.deleteMany({});

    // Insert mock data
    console.log('Inserting mock employees...');
    await Employee.insertMany(mockEmployees);
    console.log('Mock data seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
