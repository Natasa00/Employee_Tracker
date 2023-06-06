// Include packages needed for this application
const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const queries = require("./db/query.js");

// Create an array of questions for user input
const startQuestions = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
    ],
  },
];

const addDepartmentQuestions = [
  {
    type: "input",
    name: "deppartmentName",
    message: "Enter a department name:",
  },
];

function printDepartments(departments) {
  console.log(`id\tname`);
  console.log(`----------------------------`);
  departments.forEach((department) => {
    console.log(`${department.id}\t${department.name}`);
  });
}

function printRoles(roles) {
  console.log(`id\t${"title".padEnd(30, " ")}\tsalary\tdepartment`);
  console.log(
    `---------------------------------------------------------------`
  );
  roles.forEach((role) => {
    console.log(
      `${role.id}\t${role.title.padEnd(30, " ")}\t${role.salary}\t${
        role.department_name
      }`
    );
  });
}

function printEmployees(employees) {
  console.log(
    `id\t${"first name".padEnd(15, " ")}\t${"last name".padEnd(15, " ")}\t` +
      `${"job title".padEnd(20, " ")}\t` +
      `${"department".padEnd(15," ")}\tsalary\tmanager`
  );
  console.log(
    `-----------------------------------------------------------------------------------------------------`
  );
  employees.forEach((employee) => {
    console.log(
      `${employee.id}\t` +
        `${employee.first_name.padEnd(15, " ")}\t` +
        `${employee.last_name.padEnd(15, " ")}\t` +
        `${employee.title.padEnd(20, " ")}\t` +
        `${employee.department_name.padEnd(15, " ")}\t` +
        `${employee.salary}\t` +
        `${employee.manager}`
    );
  });
}

function performAction(connection, action) {
  if (action === "View all departments") {
    connection.query(queries.viewDepartments).then((results) => {
      printDepartments(results[0]);
    });
  } else if (action === "View all roles") {
    connection.query(queries.viewRoles).then((results) => {
      printRoles(results[0]);
    });
  } else if (action === "View all employees") {
    connection.query(queries.viewEmployees).then((results) => {
      printEmployees(results[0]);
    });
  }
}

// Create a function to initialize app
function init() {
  // create the connection to database
  mysql
    .createConnection({
      host: "localhost",
      user: "testuser",
      password: "FakeInsecurePassword",
      database: "employee_db",
    })
    .then((connection) => {
      inquirer.prompt(startQuestions).then((answers) => {
        performAction(connection, answers.action);
      });
    });
}

// Function call to initialize app
init();
