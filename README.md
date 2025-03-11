# RBAC---BACKEND
RBAC - BACKEND is a role base access controller system ehich uses redis for faster accessing the database without giving the road to mongoose

A robust Node.js backend application implementing a hierarchical user management system with role-based access control (RBAC) using Express.js, MongoDB, and Redis for session management.

## Features

- **Authentication System**

  - User registration (signup)
  - User login with session management
  - Secure logout functionality
  - Password encryption using bcryptjs

- **Role-Based Access Control (RBAC)**

  - Three-tier user hierarchy:
    - SuperAdmin (highest privilege)
    - Admin (intermediate privilege)
    - User (basic privilege)
  - Protected routes with role-based middleware

- **User Management Features**
  - SuperAdmin capabilities:
    - Create/delete admins
    - Create/delete users
    - Promote/demote user roles
    - View user and admin statistics
  - Admin capabilities:
    - Create/delete regular users
    - View user statistics

## Technical Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Session Management**: Redis
- **Security**:
  - Express-session for session handling
  - CORS enabled
  - HTTP-only cookies
  - Bcrypt for password hashing


