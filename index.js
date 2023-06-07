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
    name: "departmentName",
    message: "Enter the department name:",
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
  } else if (action === "Add a department") {
    inquirer.prompt(addDepartmentQuestions).then((answers) => {
      connection.query(queries.insertDepartment("NULL", answers.departmentName))
        .then(() => {
          console.log(`Department ${answers.departmentName} has been added.`);
        });
    })
  } else if (action === "Add a role") {
    connection.query(queries.viewDepartments).then((departmentRes) => {
      const departments = departmentRes[0].map((dep) => ({ name: dep.name, value: dep.id }));
      const addRoleQuestions = [
        {
          type: "input",
          name: "name",
          message: "Enter the role name:",
        },
        {
          type: "number",
          name: "salary",
          message: "Enter the salary:",
        },
        {
          type: "list",
          name: "department",
          message: "Choose a department:",
          choices: departments,
        }
      ]
      inquirer.prompt(addRoleQuestions).then((answers) => {
        connection.query(queries.insertRole(answers.name, answers.salary, answers.department))
          .then(() => {
            console.log(`Role ${answers.name} has been added.`);
          })
      })
    })
  } else if (action === "Add an employee") {
    connection.query(queries.viewRoles).then((roleRes) => {
      connection.query(queries.viewEmployees).then((employeeRes) => {
        const roleChoices = roleRes[0].map(role => ({ name: role.title, value: role.id }));
        const managerChoices = [
          { name: "None", value: "NULL" },
          ...employeeRes[0].map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
        ];
        const addEmployeeQuestions = [
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roleChoices,
          },
          {
            type: "list",
            name: "manager",
            message: "What is the employee's manager?",
            choices: managerChoices,
          },
        ]

        inquirer.prompt(addEmployeeQuestions).then(answers => {
          connection.query(queries.insertEmployee(answers.firstName, answers.lastName, answers.role, answers.manager))
            .then(() => {
              console.log(`Employee ${answers.firstName} ${answers.lastName} has been added.`);
            })
        })
      })
    })
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
