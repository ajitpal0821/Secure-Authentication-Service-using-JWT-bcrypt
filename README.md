# auth-using-NodeJs

JWT-based authentication system built with **Node.js**, **Express**, **JWT**, and **bcrypt**, demonstrating a **two-server architecture**.

---

## Project Overview

This project contains **two servers**:

1. **Auth Server** – Handles authentication, token generation, refresh, and logout.
2. **Resource Server** – Serves protected APIs and verifies JWT access tokens.

> **Note:** In this demo, `users` are stored **in-memory** for simplicity. This means `users` are **not shared across separate Node.js processes**. In production, a **database** or **Redis** should be used.

---

## Auth Server (Port: 4000)

### Features

* User login with **hashed passwords (bcrypt)**
* Generates **Access Token** (short-lived)
* Generates **Refresh Token**
* Refreshes access tokens using refresh token
* Logout by invalidating refresh token
* Secrets stored in `.env`

### Endpoints

#### `POST /login`

* Accepts `username` and `password`
* Hashes password using **bcrypt**
* Stores user in memory
* Returns:

  * `access_token`
  * `refresh_token`

#### `POST /token`

* Accepts `refresh_token`
* Verifies refresh token
* Issues a new access token

#### `DELETE /logout`

* Removes refresh token from memory

---

## Resource Server (Port: 3000)

### Features

* Verifies JWT access tokens
* Protects routes using middleware
* Returns user list and protected content

### Endpoints

#### `GET /posts`

* Protected route
* Requires JWT in header:

```
Authorization: Bearer <access_token>
```

* Returns welcome message if token is valid
* Returns `401/403` if missing/invalid

#### `GET /users`

* Returns list of users (for demo only)

#### `POST /login`

* **Demo only:** verifies credentials against `users` array
* Checks password with **bcrypt**
* Returns success message

---

## Important Notes

* **In-memory users issue:**
  Running Auth Server and Resource Server as **separate Node processes** causes `users` array to be empty in the Resource Server.
  Memory is **not shared** across Node.js processes.

* **Workarounds / Best Practices:**

  1. **Single Node process** for demo:

     ```js
     require('./authserver')
     require('./server')
     ```
  2. **Real-world solution:** Use a **database (MongoDB, PostgreSQL, etc.)** or **Redis** to store users and refresh tokens.
  3. Resource Server should **never handle passwords** in production—only verify JWT.

---

## Authentication Flow

```
Client
  |
  | Login (username/password)
  v
Auth Server
  |-- bcrypt hash password
  |-- Access Token
  |-- Refresh Token
  |
Client
  |
  | Access protected route
  v
Resource Server
  |-- Verify Access Token
  |-- Allow / Deny
  |
Client
  |
  | Access token expired
  v
Auth Server (/token)
  |-- New Access Token
```

---

## Tech Stack

* Node.js
* Express.js
* JWT
* bcrypt
* dotenv

---

## Recommended Architecture (Production)

```
Auth Server
  - Login
  - bcrypt
  - JWT generation

Database / Redis
  - Store users
  - Store refresh tokens

Resource Server
  - Verify JWT
  - Protected routes only
```

> Resource Server **never accesses passwords**. All authentication is done via **JWT**.


