# Express Mongo Project

A robust backend REST API built with Node.js, Express, and MongoDB. This project features secure JWT authentication, modular architecture, and comprehensive CRUD operations.

## 🚀 Features

- **Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
- **Authorization**: Role-based access control (Admin, Seller, User).
- **User Management**: Profile retrieval and updates.
- **Product Management**: Create, read, update, and delete products (Secondary Collection).
- **Validation**: Strict input validation using Joi.
- **Security**: Password hashing with bcrypt, protected routes, and environment variable configuration.
- **Logging**: Request logging and global error handling with Winston.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT, bcryptjs
- **Validation**: Joi
- **Logging**: Winston

## ⚙️ Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/emo-back.git
    cd emo-back
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3000
    MONGODB_URL=your_mongodb_connection_string
    MONGODB_DB_NAME=emo_db
    JWT_ACCESS_SECRET=your_access_secret_key
    JWT_REFRESH_SECRET=your_refresh_secret_key
    JWT_ACCESS_EXPIRY=15m
    JWT_REFRESH_EXPIRY=7d
    ```

4.  **Run the server:**
    ```bash
    npm run dev

    npm start
    ```

## 📖 API Documentation

### Authentication

-   **Register**
    -   `POST /api/auth/register`
    -   Body: `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`
-   **Login**
    -   `POST /api/auth/login`
    -   Body: `{ "email": "user@example.com", "password": "password123" }`
-   **Get Current User**
    -   `GET /api/auth/me`
    -   Headers: `Authorization: Bearer <token>`
-   **Update Profile**
    -   `PUT /api/auth/me`
    -   Headers: `Authorization: Bearer <token>`
    -   Body: `{ "name": "New Name", "email": "newemail@example.com" }`

### generic Resources (Products)

-   **Get All Products**
    -   `GET /api/products`
-   **Get Product by ID**
    -   `GET /api/products/:id`
-   **Create Product** (Seller/Admin only)
    -   `POST /api/products`
    -   Headers: `Authorization: Bearer <token>`
    -   Body: `{ "title": "Product Title", "price": 100, "description": "..." }`
-   **Update Product** (Seller/Admin only)
    -   `PUT /api/products/:id`
    -   Headers: `Authorization: Bearer <token>`
-   **Delete Product** (Seller/Admin only)
    -   `DELETE /api/products/:id`
    -   Headers: `Authorization: Bearer <token>`

## 📸 Screenshots

### Login
![Login Endpoint](https://via.placeholder.com/600x400?text=Login+Endpoint+Screenshot)
*Successful login returning JWT token.*

### Get Profile
![Profile Endpoint](https://via.placeholder.com/600x400?text=Get+Profile+Screenshot)
*Fetching authenticated user user profile.*

### Product List
![Product List](https://via.placeholder.com/600x400?text=Product+List+Screenshot)
*Retrieving list of available products.*

---

**Author**: Oralkhan
