const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID: ' + connection.threadId);
  // Start the application
  startApp();
});

// Prompt user to select an action
function startApp() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
      }
    });
}

// Query and display all departments
function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) {
      console.error('Error retrieving departments: ' + err);
      return;
    }
    console.table(results);
    startApp();
  });
}

// Query and display all roles
function viewAllRoles() {
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) {
      console.error('Error retrieving roles: ' + err);
      return;
    }
    console.table(results);
    startApp();
  });
}

// Query and display all employees
function viewAllEmployees() {
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) {
      console.error('Error retrieving employees: ' + err);
      return;
    }
    console.table(results);
    startApp();
  });
}

// Prompt user to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
      },
    ])
    .then((answers) => {
      connection.query(
        'INSERT INTO department (name) VALUES (?)',
        [answers.name],
        (err, results) => {
          if (err) {
            console.error('Error adding department: ' + err);
            return;
          }
          console.log('Department added successfully!');
          startApp();
        }
      );
    });
}

// Prompt user to add a role
function addRole() {
  // Retrieve departments from the database
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) {
      console.error('Error retrieving departments: ' + err);
      return;
    }
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'list',
          name: 'department',
          message: 'Select the department for the role:',
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answers) => {
        connection.query(
          'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
          [answers.title, answers.salary, answers.department],
          (err, results) => {
            if (err) {
              console.error('Error adding role: ' + err);
              return;
            }
            console.log('Role added successfully!');
            startApp();
          }
        );
      });
  });
}

// Prompt user to add an employee
function addEmployee() {
  // Retrieve roles from the database
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) {
      console.error('Error retrieving roles: ' + err);
      return;
    }
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "Enter the employee's first name:",
        },
        {
          type: 'input',
          name: 'lastName',
          message: "Enter the employee's last name:",
        },
        {
          type: 'list',
          name: 'role',
          message: "Select the employee's role:",
          choices: roles.map((role) => ({ name: role.title, value: role.id })),
        },
        {
          type: 'input',
          name: 'manager',
          message: "Enter the employee's manager (optional):",
        },
      ])
      .then((answers) => {
        connection.query(
          'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
          [answers.firstName, answers.lastName, answers.role, answers.manager],
          (err, results) => {
            if (err) {
              console.error('Error adding employee: ' + err);
              return;
            }
            console.log('Employee added successfully!');
            startApp();
          }
        );
      });
  });
}

// Prompt user to update an employee's role
function updateEmployeeRole() {
  // Retrieve employees from the database
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) {
      console.error('Error retrieving employees: ' + err);
      return;
    }
    // Retrieve roles from the database
    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) {
        console.error('Error retrieving roles: ' + err);
        return;
      }
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee',
            message: 'Select the employee to update:',
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            type: 'list',
            name: 'role',
            message: 'Select the new role for the employee:',
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
          },
        ])
        .then((answers) => {
          connection.query(
            'UPDATE employee SET role_id = ? WHERE id = ?',
            [answers.role, answers.employee],
            (err, results) => {
              if (err) {
                console.error('Error updating employee role: ' + err);
                return;
              }
              console.log('Employee role updated successfully!');
              startApp();
            }
          );
        })
        .catch((err) => {
          console.error('Error executing SQL files: ' + err);
          connection.end();
        });
    });
  });
}
