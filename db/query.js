const queries = {
  viewDepartments: `SELECT * FROM department;`,
  viewRoles: `
    SELECT role.id, role.title, role.salary, department.name AS department_name
    FROM role JOIN department
    ON role.department_id = department.id;`,
  viewEmployees: `
    SELECT emp1.id, emp1.first_name, emp1.last_name, role.title,
      department.name AS department_name, role.salary, CONCAT(emp2.first_name, " ", emp2.last_name) AS manager
    FROM employee emp1
    JOIN role ON role.id = emp1.role_id
    LEFT JOIN employee emp2 ON emp1.manager_id = emp2.id
    JOIN department ON role.department_id = department.id;`,
  insertDepartment: (departmentName) =>
    `INSERT INTO department VALUES (NULL, '${departmentName}');`,
  insertRole: (title, salary, departmentId) =>
    `INSERT INTO role VALUES (NULL, '${title}', ${salary}, ${departmentId});`,
};

module.exports = queries;
