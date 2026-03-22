# 📋 EnquiryCRM — Enquiry Management System
A full-stack MERN application to manage client enquiries with role-based access control.

---

## 🗂 Project Structure

```
enquiry-crm/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js          # User schema (bcrypt hashed password)
│   │   └── Enquiry.js       # Enquiry schema with follow-ups
│   ├── routes/
│   │   ├── auth.js          # /api/auth/login, register, me
│   │   ├── enquiries.js     # /api/enquiries CRUD + follow-ups
│   │   └── users.js         # /api/users (admin only)
│   ├── .env                 # ← Add your MongoDB URI here
│   ├── seed.js              # Seed script for initial data
│   └── server.js            # Express app entry point
│
├── frontend/
│   └── src/
│       ├── api/
│       │   └── index.js     # Axios instance + all API calls
│       ├── components/
│       │   └── Navbar.js
│       ├── context/
│       │   └── AuthContext.js  # Global auth state
│       ├── pages/
│       │   ├── LoginPage.js
│       │   ├── Dashboard.js
│       │   ├── AddEnquiry.js
│       │   ├── EnquiryDetail.js
│       │   └── ManageUsers.js  # Admin only
│       ├── App.js
│       ├── index.js
│       └── index.css
│
├── package.json             # Root — run both servers together
└── README.md
```

---

## ⚙️ Setup Instructions

### Step 1 — MongoDB Atlas Setup

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new **free cluster** (M0)
3. Under **Database Access** → Add a database user (username + password)
4. Under **Network Access** → Add IP Address → click **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Click **Connect** → **Drivers** → copy the connection string

It will look like:
```
mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

### Step 2 — Configure Backend Environment

Open `backend/.env` and replace the `MONGO_URI` line:

```env
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/enquirycrm?retryWrites=true&w=majority
JWT_SECRET=enquirycrm_super_secret_key_2025
JWT_EXPIRE=7d
```

> ⚠️ Make sure to add `/enquirycrm` before the `?` in the URI — this is the database name.

---

### Step 3 — Install Dependencies

Open terminal in the `enquiry-crm/` root folder:

```bash
# Install root dependencies (concurrently)
npm install

# Install backend and frontend dependencies
npm run install-all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### Step 4 — Seed the Database

This creates 2 users and 4 sample enquiries in MongoDB:

```bash
npm run seed
```

Output:
```
✅ Connected to MongoDB Atlas
🗑  Cleared existing users and enquiries
👤 Created user: admin@crm.com (admin)
👤 Created user: staff@crm.com (staff)
📋 Created enquiry: Priya Sharma
📋 Created enquiry: Rahul Verma
📋 Created enquiry: Sunita Patel
📋 Created enquiry: Amit Kumar
✅ Seed complete!
Login credentials:
  Admin → admin@crm.com / admin123
  Staff → staff@crm.com / staff123
```

---

### Step 5 — Run the App

```bash
# Run both backend and frontend together
npm run dev
```

This starts:
- Backend API → [http://localhost:5000](http://localhost:5000)
- Frontend React → [http://localhost:3000](http://localhost:3000)

Open your browser at **http://localhost:3000**

---

## 🔐 Login Credentials

| Role  | Email            | Password  |
|-------|-----------------|-----------|
| Admin | admin@crm.com   | admin123  |
| Staff | staff@crm.com   | staff123  |

---

## 🔁 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|---------------------|--------------------|
| POST   | /api/auth/login     | Login user         |
| POST   | /api/auth/register  | Register user      |
| GET    | /api/auth/me        | Get current user   |

### Enquiries (Protected)
| Method | Endpoint                        | Description              |
|--------|--------------------------------|--------------------------|
| GET    | /api/enquiries                  | Get all enquiries        |
| GET    | /api/enquiries/stats            | Get dashboard stats      |
| GET    | /api/enquiries/:id              | Get single enquiry       |
| POST   | /api/enquiries                  | Create new enquiry       |
| PUT    | /api/enquiries/:id/status       | Update status            |
| POST   | /api/enquiries/:id/followup     | Add follow-up note       |
| DELETE | /api/enquiries/:id              | Delete (Admin only)      |

### Users (Admin only)
| Method | Endpoint         | Description     |
|--------|-----------------|-----------------|
| GET    | /api/users       | Get all users   |
| POST   | /api/users       | Create user     |
| DELETE | /api/users/:id   | Delete user     |

---

## 👥 User Roles

### Staff
- Login
- Add new enquiries
- View all enquiries
- Add follow-up notes
- Update enquiry status
- ❌ Cannot delete enquiries
- ❌ Cannot manage users

### Admin
- All staff permissions
- ✅ Delete enquiries
- ✅ Manage users (create/delete)

---

## 🧱 Tech Stack

| Layer     | Technology          |
|-----------|-------------------|
| Frontend  | React.js, Axios   |
| Backend   | Node.js, Express  |
| Database  | MongoDB Atlas     |
| Auth      | JWT + bcryptjs    |
| Styling   | Pure CSS          |
