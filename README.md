# 🚀 CodeRunner API – Online Code Execution Backend

## 📌 Overview

CodeRunner API is a backend service that executes user-submitted code securely using Docker containers. It supports multiple programming languages, handles input/output, and stores execution history.

---

## ⚙️ Features

* Execute code (Python, C, Java)
* Multi-language support
* Input handling (stdin)
* Error handling
* Execution timeout protection
* Docker-based sandbox execution
* Execution history using MongoDB
* REST APIs

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* Docker
* MongoDB (Mongoose)

---

## 🔄 How It Works

1. User sends code via API
2. Backend saves code to a file
3. Code runs inside a Docker container
4. Output/error is captured
5. Result is stored in MongoDB
6. Response is sent back to user

---

## 📡 API Endpoints

### ▶️ Run Code

POST `/run-code`

```json
{
  "language": "python",
  "code": "print('Hello')",
  "input": "5"
}
```

---

### 📜 Get History

GET `/history`

Returns all previous executions.

---

## 🔐 Security

* Code runs inside Docker containers (isolated environment)
* Execution timeout prevents infinite loops
* No direct system access

---

## 🚀 Setup Instructions

```bash
git clone <repo-url>
cd code-runner-api
npm install
```

### Run Server

```bash
node index.js
```

### Make sure Docker is running!

---

## 💡 Future Improvements

* Authentication (JWT)
* Rate limiting
* Queue system (Redis)
* Container pooling

---

## 👨‍💻 Author

Abhignya
