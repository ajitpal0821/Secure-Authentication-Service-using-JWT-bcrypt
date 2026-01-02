<<<<<<< HEAD
# auth-using-NodeJs

Here is the **merged README + auth flow diagram** (clean & concise):

---

# auth-using-NodeJs

This project demonstrates **JWT-based authentication** using **two servers**:

1. **Auth Server** – handles authentication & token management
2. **Resource Server** – serves protected APIs

---

## Architecture Overview

* **Auth Server**

  * Responsible for login
  * Generates **Access Token** & **Refresh Token**
  * Refreshes access tokens
  * Handles logout

* **Resource Server**

  * Protects routes (e.g. `/posts`)
  * Verifies **Access Token**
  * Does NOT issue tokens

---

## Auth Server (Port: 4000)

### Endpoints

#### `POST /login`

* Generates:

  * **Access Token** (short-lived)
  * **Refresh Token** (long-lived)
* Stores refresh token in memory

#### `POST /token`

* Accepts refresh token
* Issues a **new access token**

#### `DELETE /logout`

* Removes refresh token (logout)

### Security

* Secrets stored in `.env`
* Uses `jsonwebtoken`
* Access token expires in **15 seconds**

---

## Resource Server (Port: 3000)

### Protected Route

#### `GET /posts`

* Requires **Authorization header**

```
Authorization: Bearer <access_token>
```

* Uses middleware to verify JWT
* Returns data only if token is valid

---

## Authentication Flow Diagram

```
Client
  |
  | 1. Login (username/password)
  v
Auth Server (/login)
  |
  |--> Access Token (short-lived)
  |--> Refresh Token (long-lived)
  |
Client
  |
  | 2. Request protected resource
  |    Authorization: Bearer AccessToken
  v
Resource Server (/posts)
  |
  |--> Token valid → Allow access
  |--> Token expired → 401/403
  |
Client
  |
  | 3. Access token expired
  v
Auth Server (/token)
  |
  |--> New Access Token
  |
Client
```

---

## Tech Stack

* Node.js
* Express.js
* JWT
* dotenv

---


=======
# Secure-Authentication-Service-using-JWT-bcrypt
>>>>>>> 5ae0d513eb056add5d1b56c689580ad2f7a2961f
