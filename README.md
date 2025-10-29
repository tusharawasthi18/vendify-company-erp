# Vendify Company ERP

This is the backend ERP system for Vendify Company.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v14 or later recommended)
- [MySQL](https://dev.mysql.com/downloads/installer/)

### Installing

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/tusharawasthi18/vendify-company-erp.git
    cd vendify-company-erp
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the database:**

    - Make sure your MySQL server is running.
    - Create a new database for the project. The application will automatically run the necessary migrations to set up the tables when it starts.

4.  **Create a `.env` file:**

    Create a `.env` file in the root of the project and add the following environment variables. **Replace the placeholder values with your actual database credentials.**

    ```
    PORT=3000
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    DB_PORT=3306
    JWT_SECRET=your_super_secret_jwt_key
    ```

5.  **Run the application:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

## API Documentation

Here are the available API endpoints:

### Authentication

- **POST `/auth/login`**

  Logs in a user and returns a JWT token.

  **Request Body:**

  ```json
  {
    "email": "admin@venfigy.com",
    "password": "Admin@123."
  }
  ```

### Roles

- **GET `/roles`**

  Returns a list of all roles.

  **Headers:**

  - `Authorization`: `Bearer <token>`

### Users

- **GET `/users`**

  Returns a list of all users.

  **Headers:**

  - `Authorization`: `Bearer <token>`

- **POST `/users`**

  Creates a new user. This endpoint is restricted to users with the "CA" role.

  **Headers:**

  - `Authorization`: `Bearer <token>`

  **Request Body:**

  ```json
  {
    "name": "Test user",
    "email": "test@vendify.com",
    "password": "test@123.",
    "roleId": 1
  }
  ```

- **GET `/users/me`**

  Returns the details of the currently authenticated user.

  **Headers:**

  - `Authorization`: `Bearer <token>`
