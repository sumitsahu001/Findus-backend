<h1 align="center">FindUS — Backend API</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" />
</p>

<p align="center">
  REST API for <strong>FindUS</strong> — a property discovery platform for Indore, MP.<br/>
  MVC architecture · JWT auth · bcrypt hashing · express-validator · production practices.
</p>

---

## Why this exists

I'm building FindUS as a real-world project to understand how production systems actually work — not tutorials, real decisions. This is the API layer between MongoDB and my React frontend. The frontend knows nothing about the DB. The backend knows nothing about React. Clean contract, day one.

---

## Stack

| | Tech | Why |
|---|---|---|
| Runtime | Node.js | One language across the full stack |
| Framework | Express.js v5 | Minimal — I wired things myself, no magic |
| Database | MongoDB + Mongoose | Schema validation on a document store |
| Auth | JWT | Stateless — no sessions, no server memory |
| Passwords | bcryptjs | 2¹⁰ hash rounds, irreversible — never plain text |
| Validation | express-validator | Frontend validation is UX; backend validation is security |
| Logging | morgan | `POST /user/login 200 38ms` — every request visible in dev |

---

## Structure

```
Findus-backend/
├── server.js                   # Bootstrap: cors → json → morgan → errorMiddleware → listen
├── config/db.js                # mongoose.connect(), process.exit(1) on failure
├── models/User.model.js        # Updated: role + Renter CV fields (occupation, income)
├── controllers/
│   └── auth.controller.js      # Updated: Wrapped in asyncHandler, standardized responses
├── routes/
│   └── auth.routes.js          # POST /user/save  ·  POST /user/login
├── middleware/
│   ├── validate.middleware.js  # Input rules — runs before controller
│   ├── auth.middleware.js      # JWT verifier
│   └── error.middleware.js     # GLOBAL ERROR HANDLER — catches all crashes
└── utils/
    ├── response.js             # Success/Error helpers
    └── asyncHandler.js         # Production utility to remove try-catch bloat
```

---

## How a login request flows

```
POST /user/login
  → auth.routes.js
  → validateLogin()            email format check, password not empty
  → loginUser()
      1. User.findOne({ email })          hit MongoDB
      2. bcrypt.compare(plain, hash)      verify without ever decrypting
      3. jwt.sign({ id, role }, secret)   7-day signed token
      4. return { token, user: { name, role } }
  → client stores token in localStorage
  → sends via Authorization header on every protected request
```

---

## API

Base URL: `http://localhost:5000`

| Method | Endpoint | What it does |
|---|---|---|
| `POST` | `/user/save` | Register — hash password, save user |
| `POST` | `/user/login` | Login — verify creds, return JWT |

**Register:**
```json
{ "name":"Sumit Sahu", "email":"sumit@mail.com", "password":"secret123",
  "mobile":"9876543210", "address":"123 MG Road", "city":"Indore", "area":"Vijay Nagar", "gender":"male" }
```
**Login returns:**
```json
{ "token": "eyJ...", "user": { "name": "Sumit Sahu", "role": "user" } }
```

---

## Run locally

```bash
git clone https://github.com/sumit-sahu-fullstack/findus-backend.git
cd findus-backend
npm install
cp .env.example .env   # add your MONGO_URI and JWT_SECRET
npm run dev            # nodemon → http://localhost:5000
```

---

- **Renter Dashboard (v1.0)** — Modular sidebar, "Recently Viewed" history (LocalStorage).
- **Global Error Handling** — Centralized infrastructure to handle crashes.
- **Renter CV Support** — Expanded User schema for professional profiles.

## Coming next (Tomorrow's Goal)

- **Phase 2 Backend**: Implement `Property.model.js` and `Application.model.js`.
- **API Real Data**: Connect dashboard tabs (Applications, Favorites) to real backend endpoints.
- **CV Persistence**: Save "Renter CV" directly to MongoDB.
- **Map View API**: Finalize Indore-specific property coordinates.

---

## Built by

**Sumit Sahu** — Full Stack Developer (MERN), Indore, India.  
Self-taught. Transitioned from BCom to code. Two internships. Building real things to learn how they actually work.

[LinkedIn](https://www.linkedin.com/in/sumit-sahu-fullstack/) · [Portfolio](https://personal-portfolio-sumit-sahu.netlify.app)

> *Built while learning. Every line written with intent.*
