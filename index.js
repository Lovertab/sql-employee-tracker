const inquirer = require('inquirer');
const { Pool } = require('pg');
// const pool = {};

const pool = new Pool(
    {
        user: 'postgres',
        password: '215242405',
        host: 'localhost',
        database: 'tracker_db'
    },
    console.log('Connected to employeeTracker_db successfully!!')
);


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
        name: 'firstName',
        when: (answers) => answers.questions === 'Add Employee',
    },
    {
        type: 'input',
        messgae: 'What is the employee last name?',
        name: 'lastName',
        when: (answers) => answers.questions === 'Add Employee',
    },
    {
        type: 'input',
        messgae: 'What is the employee role?',
        name: 'employeeRole',
        when: (answers) => answers.questions === 'Add Employee',
    },
    {
        type: 'input',
        messgae: 'Who is the employee manager?',
        name: 'employeeManager',
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
        messgae: 'What is the tile of the role?',
        name: 'roleTitle',
        when: (answers) => answers.questions === 'Add Role' || answers.questions === 'Update Role',
    },
    // start for role sub questions
    {
        type: 'input',
        messgae: 'What is the salary of the role?',
        name: 'roleSalary',
        when: (answers) => answers.questions === 'Add Role' || answers.questions === 'Update Role',
    },
    {
        type: 'input',
        messgae: 'Which department does the role belong to?',
        name: 'roleDepartment',
        when: (answers) => answers.questions === 'Add Role' || answers.questions === 'Update Role',
    },
    // end
    {
        type: 'input',
        messgae: 'What is the name of the department?',
        name: 'department',
        when: (answers) => answers.questions === 'Add Department' || answers.questions === 'Update Employee Department',
    },
    {
        type: 'input',
        messgae: 'Input role_id number',
        name: 'inputRoleId',
        when: (answers) =>  answers.questions === 'Update Employee Role'|| answers.question=== 'Add Employee',
    },
    {
        type: 'input',
        messgae: 'Input employee_id number',
        name: 'inputEmployeeId',
        when: (answers) => answers.questions === 'Update Employee Role'|| answers.question=== 'Add Employee',
    },


];

function init(pool) {
    inquirer
        .prompt(questions)
        .then((answers) => {
            console.log(answers)
            if (answers.questions === 'View All Employees') {
                pool.query('SELECT * FROM employees', function (err, result) {
                    if (err) throw err;
                    console.table(result.rows);
                    init(pool);
                });

            }
             if (answers.questions === 'Add Employee') {
                pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                    [answers.firstName, answers.lastName, answers.employeeRole, answers.employeeManager],
                    function (err, result) {
                        if (err) throw err;
                        console.table(result.rows);
                        init(pool);
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
                    [answers.roleTitle, answers.roleDepartment,answers.roleSalary],
                    function (err, result) {
                        if (err) throw err;
                        console.table(result);
                    });
            }
            if (answers.questions === 'Update Employee Role') {
                pool.query('UPDATE employee SET role_id=? WHERE id=? ',
                    [answers.inputRoleId, answers.inputEmployeeId],
                    function (err, result) {
                        if (err) throw err;
                        console.table(result);
                    });
            }
            if (answers.questions === 'View All Departments') {
                pool.query('SELECT * FROM departments', function (err, result) {
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
// init()

pool.connect(function (err, client, done) {
    if (err) throw err;
    init(client)
})
    // .then(client => {
    //     init(client);
    // }).catch(err => {
    //     console.log(err);
    // });