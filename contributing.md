# Contributing to Task Manager

Thank you for your interest in contributing to **Task Manager**! 🙌
This project is open-source and we welcome contributions of all kinds — code, bug fixes, documentation, or feature requests.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [How to Contribute](#how-to-contribute)
3. [Creating Issues](#creating-issues)
4. [Code Guidelines](#code-guidelines)
5. [Pull Requests](#pull-requests)
6. [Community & Support](#community--support)

---

## Getting Started

To contribute, you need to have Node.js and npm installed, and a local copy of the project:

```bash
# Clone your fork of the repository
git clone https://github.com/<your-username>/task-manager.git
cd task-manager

# Install dependencies for backend and frontend
cd backend
npm install
cp .env.example .env    # create your own .env file with proper credentials
npm start               # start backend server at http://localhost:4000

cd ../frontend
npm install
npm start               # start frontend at http://localhost:5173
```

Make sure the project runs correctly locally before submitting any changes.

---

## How to Contribute

1. **Fork the repository**  
2. **Create a new branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes (bug fix, new feature, documentation update)  
4. **Commit your changes** using clear, descriptive messages:
   ```bash
   git add .
   git commit -m "feat(tasks): add bulk delete feature"
   ```
5. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** to the main repository, describing what you changed and why.

---

## Creating Issues

Before working on a feature or bug:

- Check if a similar issue already exists.  
- If not, create a new issue with:
  - **Title**: Short and descriptive  
  - **Description**: Explain the problem or feature in detail  
  - **Labels**: `bug`, `enhancement`, `good first issue`, `help wanted`

---

## Code Guidelines

- Follow the **existing code style** for JavaScript, Node.js, and React.  
- Keep **commit messages concise and descriptive**.  
- Test your changes locally to ensure nothing breaks.  
- Avoid pushing secrets or `.env` files — use `.env.example` instead.

---

## Pull Requests

- Reference the issue you are solving, e.g., `Closes #12`.  
- Provide screenshots if you are updating UI components.  
- Make sure your PR **only contains related changes**.  
- Wait for a review — maintainers may request changes before merging.

---

## Community & Support

- Be respectful and patient in all interactions  
- Ask questions in issues if you are unsure  
- Contributions of all skill levels are welcome  

---

Thank you for helping improve **Task Manager**! 💻✨

