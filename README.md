# Full-Stack Store Rating Application

A complete web application built for a full-stack coding challenge. It allows users to register, log in, view a list of stores, and submit 1-5 star ratings. The application features three distinct user roles (Normal User, Store Owner, System Administrator) with different permissions and dashboards.

## Features

- **Core System**
  - [x] Secure NestJS backend API with a PostgreSQL database.
  - [x] Modern React frontend with TypeScript and Tailwind CSS.
  - [x] Role-based authentication and authorization using JWT.

- **Normal User**
  - [x] Can sign up, log in, and update their password.
  - [x] Can view and search for stores by name and address.
  - [x] Can see each store's average rating and their own submitted rating.
  - [x] Can submit and modify ratings for stores.

- **System Administrator**
  - [x] Has a comprehensive, protected dashboard with platform statistics.
  - [x] Can view, filter, and create users with any role.
  - [x] Can create stores and assign store owners.
  - [x] Can view a store's average rating from the user list if the user is a store owner.

- **Store Owner**
  - [x] Has a dedicated, protected dashboard.
  - [x] Can view their specific store's average rating.
  - [x] Can see a list of all users who have rated their store.

## Tech Stack

-   **Frontend:**
    -   React.js (with Vite)
    -   TypeScript
    -   Tailwind CSS
    -   Axios
    -   React Router
    -   React Hook Form
-   **Backend:**
    -   NestJS
    -   Sequelize ORM
    -   PostgreSQL
    -   Passport.js (for JWT Authentication)
    -   `class-validator` for DTO validation

## Project Structure
-  **/store-rating-app**
    -  /backend         # NestJS Application
    -  /frontend        # React (Vite) Application
 
## Setup and Installation

### Prerequisites

-   Node.js (v18 or newer)
-   npm
-   PostgreSQL

### 1. Database Setup

You need to have a PostgreSQL database running. Create a new database and a user for this application.
```sql
CREATE DATABASE store_ratings;
CREATE USER store_ratings_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE store_ratings TO store_ratings_user;
```
### 2. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a `.env` file:**
    Copy the template below into a new file named `.env` in your `/backend` folder.

    ```env
    # Database Configuration
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=store_ratings_user
    DB_PASSWORD=your_secure_password
    DB_DATABASE=store_ratings

    # JWT Configuration
    JWT_SECRET=thisIsAReallySecretKeyPleaseChangeIt
    ```
    Be sure to update the values to match your actual database credentials.

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run start:dev
    ```
    The backend will now be running on `http://localhost:3000`. On its first run, it will automatically create all the necessary tables in your database.

### 3. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173`.

---

### Creating the First Admin User

The public signup form only creates `normal_user` roles. To access the admin dashboard, you must manually promote a user.

1.  Sign up with a new user (e.g., `admin@example.com`) through the frontend application.
2.  Connect to your PostgreSQL database.
3.  Run the following SQL command:
    ```sql
    UPDATE users SET role = 'system_admin' WHERE email = 'admin@example.com';
    ```
You can now log in with this user to access the admin features.
