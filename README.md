# Task Manager App

A full-stack **Task Manager application** built with **Node.js**, **Express**, **MongoDB**, and **React.js**.
This project allows users to **create, update, delete, and manage tasks** efficiently with a clean, modern interface and a robust backend API.

---

## Features

* **User Authentication & Authorization**

  * Secure login and registration
  * JWT-based authentication for API routes

* **Task Management**

  * Create, read, update, and delete tasks (CRUD)
  * Mark tasks as completed or pending
  * Organize tasks by categories or priority (optional feature)

* **Responsive UI**

  * Clean and intuitive React frontend
  * Works seamlessly on desktop and mobile devices

* **API Endpoints**

  * RESTful API endpoints for task management
  * Proper error handling and validation

* **Database**

  * MongoDB used to store users and tasks
  * Mongoose ODM for schema management

---

## Tech Stack

| Layer          | Technology            |
| -------------- | --------------------- |
| Frontend       | React.js, HTML, CSS   |
| Backend        | Node.js, Express.js   |
| Database       | MongoDB, Mongoose     |
| Authentication | JWT (JSON Web Tokens) |

---

## Installation & Setup

### Prerequisites

* Node.js >= 18.x
* npm >= 9.x
* MongoDB (local or Atlas)

### Clone the repository

```bash
git clone git@github.com:shafqat-baloch786/task-manager.git
cd task-manager
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env    # create your own .env file
npm start               # starts the backend at http://localhost:4000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start               # starts React frontend at http://localhost:5173
```

---

## Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Email configuration (for Nodemailer)
EMAIL_USER=your_email
EMAIL_PASS=gmail_app_password
```

> **Important:** Do not commit your `.env` file to GitHub. Use `.env.example` for reference.

---

## Usage

1. Register a new user or login with existing credentials
2. Create, update, and delete tasks
3. Mark tasks as completed or pending
4. Manage tasks efficiently using the responsive UI

---

## Folder Structure

```
task-manager/
├─ backend/               # Node.js + Express API
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ middleware/
│  └─ server.js
├─ frontend/              # React.js frontend
│  ├─ src/
│  ├─ public/
│  └─ package.json
├─ .gitignore
├─ README.md
├─ LICENSE
└─ .env.example
```

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/feature-name`)
3. Make changes and commit (`git commit -m "Add feature"`)
4. Push the branch (`git push origin feature/feature-name`)
5. Open a Pull Request

---

## License

MIT License

Copyright (c) 2025 Shafqat Baloch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Contact

**Author:** Shafqat Baloch
**GitHub:** [shafqat-baloch786](https://github.com/shafqat-baloch786)
**Email:** [shafqatbaloch875@gmail.com](mailto:shafqatbaloch875@gmail.com)
