const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const pool = new Pool(
    {
        user: 'postgres',
        password: '215242405',
        host: 'localhost',
        database: 'employeeTracker_db'
    },
    console.log('Connected to employeeTracker_db successfully!!')
);
pool.connect();

const questions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'questions',
        choices: ['View All Employees','Add Employee', 'Update Employee Role', 'View All Departments','Add Department', 'View All Roles', 'Add Role', 'Quit'],
    },
    // start for adding employees
    {
        type: 'input',
        messgae: 'What is the employee first name?',
        name: 'employee',
        when: (answers) => answers.questions === 'Add Employee',
    },
    {
        type: 'input',
        messgae: 'What is the employee last name?',
        name: 'employee',
        when: (answers) => answers.questions === 'Add Employee',
    },
    {
        type: 'input',
        messgae: 'What is the employee role?',
        name: 'employee',
        when: (answers) => answers.questions === 'Add Employee',
    },
    {
        type: 'input',
        messgae: 'Who is the employee manager?',
        name: 'employee',
        when: (answers) => answers.questions === 'Add Employee',
    },
    // end of adding employee
    // start of updating employee role
    {
        type: 'input',
        messgae: 'Which employee role do you want to update?',
        name: 'updateEmployeeRole',
        when: (answers) => answers.questions === 'Update Employee Role',
    },
    {
        type: 'input',
        messgae: 'Which role do you want to assin the selected employee?',
        name: 'updateEmployeeRole',
        when: (answers) => answers.questions === 'Update Employee Role',
    },
    // end of updating employee role
    {
        type: 'input',
        messgae: 'What is the name of the department?',
        name: 'department',
        when: (answers) => answers.questions === 'Add Department' || answers.questions === 'Update Employee Department',
    },
    {
        type: 'input',
        messgae: 'What is the name of the role?',
        name: 'role',
        when: (answers) => answers.questions === 'Add Role' || answers.questions === 'Update Role',
    },
    // start for role sub questions
    {
        type: 'input',
        messgae: 'What is the salary of the role?',
        name: 'role',
        when: (answers) => answers.questions === 'Add Role' || answers.questions === 'Update Role',
    },
    {
        type: 'input',
        messgae: 'Which department does the role belong to?',
        name: 'role',
        when: (answers) => answers.questions === 'Add Role' || answers.questions === 'Update Role',
    },
    // end
    {
        type: 'input',
        messgae: 'What is the name of the department?',
        name: 'department',
        when: (answers) => answers.questions === 'Add Department' || answers.questions === 'Update Employee Department',
    }


];

function init() {
    inquirer
        .prompt(questions)
        .then((answers) => {
            if (answers.questions === 'View All Employees') {
                pool.query('SELECT * FROM employees', function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    init();
                });

            }
             if (answers.questions === 'Add Employee') {
                pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                    [answers.employees, answers.first_name, answers.last_name, answers.role_id, answers.manager_id],
                    function (err, result) {
                        if (err) throw err;
                        console.table(result);
                    });

             }
            if (answers.questions === 'View All Roles') {
                pool.query('SELECT * FROM roles', function (err, result) {
                    if (err) throw err;
                    console.table(result);
                });

            }
            if (answers.questions === 'Add Role') {
                pool.query('INSERT INTO roles (title, department_id, salary) VALUES (?, ?, ?)',
                    [answers.roles, answers.title, answers.department_id,answers.salary],
                    function (err, result) {
                        if (err) throw err;
                        console.table(result);
                    });
            }
            // check
            if (answers.questions === 'Update Employee Role') {
                pool.query('UPDATE INTO employee (title, department_id, salary) VALUES (?, ?, ?)',
                    [answers.employees],
                    function (err, result) {
                        if (err) throw err;
                        console.table(result);
                    });
            }
            if (answers.questions === 'View All Departments') {
                pool.query('SELECT * FROM depatments', function (err, result) {
                    if (err) throw err;
                    console.table(result);
                });

            }
            if (answers.questions === 'Add Department') {
                pool.query('INSERT INTO departments (name) VALUES (?)',
                    [answers.department, answers.name],
                    function (err, result) {
                        if (err) throw err;
                        console.table(result);
                    });
            }
            if (answers.questions === 'Update Employee Department') {
                pool.query('UPDATE INTO employees (title, department_id, salary) VALUES (?, ?, ?)',
                    function (err, result) {
                    if (err) throw err;
                    console.table(result);
                });

            }
            console.log(answers);
        });
}
init();
