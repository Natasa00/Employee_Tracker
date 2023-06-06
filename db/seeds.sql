USE employee_db;

INSERT INTO department (id, name)
VALUES (1, "Engineering"),
       (2, "Finance");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Lead Engineer", 200000, 1),
       (2, "Software Engineer", 140000, 1),
       (3, "Account Manager", 200000, 2),
       (4, "Accountant", 140000, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Mike", "Chan", 1, NULL),
       (2, "Sarah", "Johnson", 2, 1),
       (3, "Kevin", "Tupik", 2, 1),
       (4, "Peter", "Parker", 3, NULL),
       (5, "Tom", "Allen", 4, 4),
       (6, "Tanya", "Peterson", 4, 4);
