<h1 align="center">FindWithUs — Backend (The Engine) ⚙️</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Multer-Uploads-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Production--Ready-brightgreen?style=flat-square" />
</p>

### "A solid foundation is the key to a stress-free UI." 🤝

FindWithUs isn't just another tutorial project. It’s a production-ready engine built specifically for the property market in **Indore, MP**. I built this focus on clean REST principles, robust validation, and real-world file handling. No fluff, just code that works.

---

## 🔥 Key Features (v1.5)

- **Role-Based Auth (JWT):** Separate flows for **Renters** and **Landlords**.
- **Multi-Image Uploads:** Custom `Multer` integration for property listings. Handled on local storage for speed and control.
- **Renter CV Integration:** Dynamic aggregation of renter profiles (occupation, income) stored directly in MongoDB.
- **Live Stats Engine:** Real-time calculation of active listings and application counts for the Landlord Dashboard.
- **Centralized Error Handling:** Global middleware that catches every crash and returns professional JSON responses.

## 🛠️ The Management Approach

| Component | Tech | Why I chose it |
|---|---|---|
| **Architecture** | MVC | Separation of concerns. Route → Validate → Control → Model. |
| **File Handling** | Multer | Because property search is visual. Standardized storage for `/uploads`. |
| **Logic** | asyncHandler | Removed try-catch bloat to keep controllers 100% readable. |
| **Security** | bcryptjs | Passwords are never stored as text. Safety first, always. |

## 🌟 Why this project is different?

Most property apps are generic. **FindWithUs** is local. It understands the "Vijay Nagar" or "Bhawarkua" market. I’ve wired the map API to show real-time "hotspots" based on actual database entries, not fake markers. It feels like a real product because it is one.

## 💡 What I Learned (From the Heart)

Coming from a **BCom background**, I used to be scared of complex backend logic. This project taught me:
1.  **MVC is Freedom:** Once your folders are organized, adding a feature like "Extra Services" takes minutes, not hours.
2.  **Data Consistency:** Learning to use `.populate()` correctly changed how I view relationships in NoSQL.
3.  **The "Indori" User:** Building for a specific city makes UX decisions easier. You know what people are looking for.

---

## 🚀 Get Started

```bash
# Clone & Install
git clone [repo-url]
npm install

# Setup Env
# Create .env with MONGO_URI, JWT_SECRET, and PORT=5000

# Start Engine
npm run dev
```

---

**Built with pride by Sumit Sahu.**  
*Indori Full-Stack Dev. Writing code that solves real problems.* 💎🚀
