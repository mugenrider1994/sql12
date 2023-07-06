-- Insert departments
INSERT INTO department (id, name)
VALUES
  (1, 'Department 1'),
  (2, 'Department 2'),
  (3, 'Department 3');

-- Insert roles
INSERT INTO role (id, title, salary, department_id)
VALUES
  (1, 'Role 1', 50000, 1),
  (2, 'Role 2', 60000, 2),
  (3, 'Role 3', 70000, 3);

-- Insert employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Mugen', 'Rider', 1, 0),
       (2, 'Breezy', 'Smith', 2, 1),
       (3, 'Michael', 'Jordan', 3, 1);