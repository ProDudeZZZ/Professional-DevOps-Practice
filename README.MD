# Todo App Backend

A backend-only Todo application built with **Node.js** and **Express**, fully Dockerized and deployed on **Render**, using **MongoDB Atlas** as the cloud database. The project includes automated testing and CI/CD using **GitHub Actions**.

---

## Folder Structure

```
├── Dockerfile
├── docker-compose.yml
├── app.js
├── index.js
├── server.js
├── config/db.js
├── middleware/auth.middleware.js
├── models/
│   ├── todo.model.js
│   └── user.model.js
├── routes/
│   ├── todo.routes.js
│   └── user.routes.js
├── tests/
│   ├── app.test.js
│   ├── auth.test.js
│   ├── setup.js
│   └── todos.test.js
├── test-report/index.html
├── package.json
└── package-lock.json
```


---

## Environment Variables

Create a `.env` file in the root:
```
PORT=3000
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET_KEY=<your-jwt-secret>
```

## API Endpoints

### Auth Routes
POST /auth/signup → Register a new user
Body: { name, email, password }

POST /auth/login → Login user
Body: { email, password }

### Todo Routes
POST /todos → Create a new todo
Body: { title, description }

GET /todos → Get all todos

GET /todos/:id → Get a single todo by ID
Param: id

PUT /todos/:id → Update a todo by ID
Body: { title, description }

DELETE /todos/:id → Delete a todo by ID
Param: id

## Run Locally

```bash
# Install dependencies
npm install

# Start server
npm run dev

# Run tests
npm tesT
```

### Build and run using Docker
```
docker compose up -d --build
```

## CI/CD
GitHub Actions handles testing and Docker image build/push.

Docker image deployed automatically to Render

## Technologies Used
Node.js

Express.js

MongoDB Atlas

Docker

GitHub Actions

Render (deployment)