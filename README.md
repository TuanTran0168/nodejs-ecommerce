# 🛒 Backend E-commerce API

A **Node.js + Express + MongoDB** backend for an e-commerce platform.  
Provides APIs for authentication, shop management, and API key validation.

---

## 🚀 Features
- 🔑 Auth (JWT, API Key)
- 🏬 Shop management
- ⚡ Centralized error/success handling
- 🛡 Secure & scalable architecture

---

## 📂 Structure


```
backend-ecommerce/
├── docs/               # Documentation, notes
├── src/
│   ├── configs/        # Database and app configs
│   ├── controllers/    # Request handlers (business logic entry points)
│   ├── core/           # Response wrapper (success & error)
│   ├── databases/      # MongoDB connection setup
│   ├── helpers/        # Utility helpers
│   ├── middlewares/    # Custom middlewares
│   ├── models/         # Mongoose models
│   ├── postman/        # Postman API collections
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic (service layer)
│   ├── utils/          # Common utilities (status codes, auth, etc.)
│   └── app.js          # Express app setup
├── server.js           # App entry point
├── package.json        # Dependencies
└── README.md           # Project documentation
```

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/backend-ecommerce.git
cd backend-ecommerce
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```env
NODE_ENV=development      #production
DEV_APP_PORT=3080
DEV_DATABASE_HOST=localhost
DEV_DATABASE_PORT=27017
DEV_DATABASE_NAME=your_db_name
```

### 4. Run the server
```bash
npm run dev
```

Server runs on: `http://localhost:3080`

---


## 🧪 Testing

Use the **Postman collection** inside:
```
src/postman/access.post.http
```

Or import into Postman and test endpoints.

---

## 📚 Scripts

- `npm start` → Run server
- `npm run dev` → Run server with nodemon

---

