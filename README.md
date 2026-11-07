
<div align="center">

# 🛍️ CARTZY
### Full Stack E-Commerce Platform

**A Modern Online Shopping Experience Built with MERN Stack**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-API-black?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/Authentication-JWT-black)](https://jwt.io/)

</div>

---

## 🚀 About CARTZY

CARTZY is a responsive, full-stack e-commerce web application inspired by Amazon India.

It provides a complete online shopping experience with secure authentication, product discovery, shopping cart management, checkout, order tracking, and a powerful admin dashboard.

Built using React.js, Node.js, Express.js, MongoDB, and JWT authentication.

## ✨ Key Features

### 🛒 Customer Features
- User Registration and Login
- Secure JWT Authentication
- Browse Products with Images and Prices
- Search Products
- Filter Products by Category
- Price and Rating Filters
- Product Pagination
- Product Details Page
- Add Products to Cart
- Increase / Decrease Quantity
- Remove Cart Items
- Automatic Cart Total Calculation
- Checkout and Place Orders
- Order History
- Order Status Tracking
- Cancel Eligible Orders

### 🔐 Authentication & Security
- JWT-based Authentication
- Password Hashing using bcryptjs
- Protected User Routes
- Role-Based Authorization
- Admin Route Protection
- Input Validation
- Secure Backend API

### 🛠️ Admin Dashboard
- Admin Login
- Dashboard Statistics
- Add New Products
- Edit Existing Products
- Delete Products
- Upload Product Images
- View All Products
- View All Customer Orders
- Update Order Status
- Manage Registered Users

### 📦 Order Management
- Pending
- Processing
- Delivered
- Cancelled

## 💻 Tech Stack

| Technology | Usage |
|---|---|
| React.js | Frontend |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Node.js | Backend Runtime |
| Express.js | REST API |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Multer | Image Upload |
| Axios | API Requests |
| React Router | Navigation |

## 🏗️ Project Architecture

```text
CARTZY
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── seeder.js
│   ├── server.js
│   └── package.json
│
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/cartzy-ecommerce-platform.git

cd cartzy-ecommerce-platform
```

### 2. Install Dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

If your frontend uses `VITE_API_URL`, configure it in `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

**Important:** Never upload `.env` files or database credentials to GitHub.

### 4. Seed Database (Optional)

```bash
cd server
node seeder.js
```

### 5. Start Backend

```bash
cd server
npm run dev
```

### 6. Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Open the local URL shown in your terminal.

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/users/register | Register User |
| POST | /api/users/login | User Login |
| GET | /api/users/profile | User Profile |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | Get All Products |
| GET | /api/products/:id | Get Product Details |
| POST | /api/products | Add Product |
| PUT | /api/products/:id | Update Product |
| DELETE | /api/products/:id | Delete Product |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/orders | Place Order |
| GET | /api/orders/myorders | Order History |
| GET | /api/orders | Get All Orders |
| PUT | /api/orders/:id/status | Update Order Status |

### Image Upload

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/upload | Upload Product Image |

*Protected and admin-only endpoints require the appropriate authorization.*

## 🌐 Live Demo

**Frontend:** YOUR_FRONTEND_URL

**Backend API:** YOUR_BACKEND_URL

**GitHub:** YOUR_GITHUB_REPOSITORY_URL

## 📸 Screenshots

Add your actual project screenshots here.

```markdown
![Home Page](screenshots/home.png)
![Product Page](screenshots/products.png)
![Shopping Cart](screenshots/cart.png)
![Admin Dashboard](screenshots/admin.png)
```

## 🔒 Security

- Passwords are hashed before database storage.
- JWT protects authenticated routes.
- Admin permissions are validated on the backend.
- Sensitive environment variables are not exposed.
- Input validation is implemented.
- Product image uploads are handled through Multer.

## 🎯 Project Objective

CARTZY demonstrates practical full-stack development skills, including:

- Responsive frontend development
- REST API development
- MongoDB database integration
- JWT authentication and authorization
- Shopping cart and checkout implementation
- Order management
- Admin dashboard development
- Full-stack deployment

## 👨‍💻 Author

**Santhosh**

GitHub: https://github.com/santhosh-103

---

<div align="center">

### ⭐ CARTZY – Shop Smarter. Shop Better.

**Built with ❤️ using the MERN Stack**

</div>
