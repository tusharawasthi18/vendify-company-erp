--  COMPANY TABLE
CREATE TABLE
  IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

--  ROLES TABLE
CREATE TABLE
  IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

--  USERS TABLE
CREATE TABLE
  IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    company_id INT NOT NULL,
    role_id INT NOT NULL,
    created_by INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies (id),
    FOREIGN KEY (role_id) REFERENCES roles (id),
    FOREIGN KEY (created_by) REFERENCES users (id)
  );

--  SEED DATA
-- Insert a sample company
INSERT INTO
  companies (name)
SELECT
  'Vendify Pvt Ltd'
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      companies
    WHERE
      name = 'Vendify Pvt Ltd'
  );

-- Insert roles if not already present
INSERT INTO
  roles (name)
SELECT
  'CA'
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      roles
    WHERE
      name = 'CA'
  );

INSERT INTO
  roles (name)
SELECT
  'Store Manager'
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      roles
    WHERE
      name = 'Store Manager'
  );

INSERT INTO
  roles (name)
SELECT
  'Finance Manager'
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      roles
    WHERE
      name = 'Finance Manager'
  );

-- Insert initial Company Admin (CA)
-- Password: 'admin123' (hashed)
INSERT INTO
  users (company_id, role_id, name, email, password)
SELECT
  (
    SELECT
      id
    FROM
      companies
    WHERE
      name = 'Vendify Pvt Ltd'
  ),
  (
    SELECT
      id
    FROM
      roles
    WHERE
      name = 'CA'
  ),
  'Admin User',
  'admin@vendify.com',
  '$2b$10$fZilPmXxWNTsdv3Rz/l4w.gH65GmLqc.nGzAix9MibtmshcXfCwGu'
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      users
    WHERE
      email = 'admin@vendify.com'
  );