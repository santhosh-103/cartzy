# Amazon.in Clone - Full Stack E-Commerce Platform

A production-ready, responsive E-Commerce web application modeled after **[Amazon.in](https://www.amazon.in/)**, built using the MERN stack (**React.js, Node.js, Express.js, MongoDB Atlas**) with **JWT Authentication** and an **Admin Seller Central Dashboard**.

---

## 🚀 Tech Stack

- **Frontend (`/client`)**: React 18, Vite, Tailwind CSS, Lucide React, React Router v6, Axios
- **Backend (`/server`)**: Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `multer` (File Uploads), `cors`, `dotenv`
- **Database**: MongoDB (MongoDB Atlas cloud connection string or local MongoDB)
- **Architecture**: Decoupled Client-Server REST API architecture

---

## ✨ Features Checklist

### 🛍️ Customer Experience
- [x] **Amazon India Design**: Exact header layout with Amazon.in branding, delivery location pin, category dropdown search, cart counter, Amazon subnavigation bar, and multi-tier footer.
- [x] **Product Search**: Real-time keyword search across product name, brand, description, and category.
- [x] **Category Filtering & Price Range**: Filter products by department (*Mobiles, Laptops, Audio, Wearables, Home & Kitchen, Fashion, Books*), price ranges, and minimum customer ratings.
- [x] **Pagination**: Clean, responsive pagination controls for product listings.
- [x] **Product Details Page**: High-resolution gallery preview, pricing breakdown with discount percentage, bullet point features, stock status, and "Add to Cart" / "Buy Now" quick checkout.
- [x] **Shopping Cart**:
  - Add products to cart with stock validation.
  - Increase or decrease product quantity.
  - Remove items or clear cart.
  - Real-time subtotal, savings calculation, and free delivery qualification bar.
  - Persistent state across browser refreshes via `localStorage`.
- [x] **Checkout Flow**:
  - Step 1: Shipping Address input with validation (Full Name, Phone, Street, City, State, PIN code).
  - Step 2: Payment Method selection (**Cash on Delivery / COD**, **Credit/Debit Card**, **UPI / QR Code**, **Net Banking**).
  - Step 3: Review items and delivery schedule.
  - Order summary sidebar with items total, delivery fee, taxes, and final payable amount.
- [x] **Order Placement & Confirmation**: Order ID generation, delivery estimation, and order summary.
- [x] **"Your Orders" (Order History)**:
  - Visual status progress bar (**Order Confirmed ➔ Dispatched / Out for Delivery ➔ Delivered**).
  - Order details, item breakdown, and delivery addresses.
  - Cancel Order button for active pending/processing orders.

### 🔐 Authentication & Security
- [x] **User Registration**: Name, Email, Password, Phone number, and Confirm Password with comprehensive validation.
- [x] **User Login**: Secure authentication with JWT token stored in browser and auto-injected into API requests.
- [x] **Password Protection**: Salted password hashing with `bcryptjs`.
- [x] **Route Protection**:
  - `ProtectedRoute`: Prevents unauthenticated users from accessing checkout or orders.
  - `AdminRoute`: Strictly restricts `/admin` to users with `isAdmin: true` and blocks regular customers with an error banner.

### 🛠️ Admin Seller Central Panel (`/admin`)
- [x] **KPI Metrics**: Real-time summary cards for Total Revenue (₹), Total Orders, Total Products, and Registered Users.
- [x] **Product Management**:
  - View all products in a searchable table.
  - **Add New Product**: Form with Name, Brand, Category, Price, MRP, Stock, Badges (*Best Seller, Deal of the Day, Amazon's Choice*), Description, and Bullet Features.
  - **Edit Products**: Update price, stock count, descriptions, and details.
  - **Delete Products**: Remove discontinued products with confirmation.
  - **Product Image Upload**: Built-in **Multer** file uploader for local image storage and support for remote image URLs.
- [x] **Order Fulfillment**:
  - View all customer orders with customer contact and shipping details.
  - Filter orders by status (*Pending, Processing, Delivered, Cancelled*).
  - **Update Order Status**: Change status via dropdown with immediate database sync.
- [x] **User Directory**: List registered customers and administrators.

---

## 📂 Project Structure

```text
E_Commerce/
├── client/                     # Frontend (React.js + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, SubNav, Footer, ProductCard, RatingStars, ProtectedRoute, AdminRoute
│   │   ├── context/            # AuthContext, CartContext, ToastContext
│   │   ├── pages/              # HomePage, ProductDetailPage, CartPage, CheckoutPage, OrderSuccessPage, OrderHistoryPage, LoginPage, RegisterPage, AdminDashboardPage
│   │   ├── utils/              # api.js (Axios instance with JWT interceptor)
│   │   ├── App.jsx             # React Router config
│   │   ├── index.css           # Tailwind & Amazon custom styles
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express.js + MongoDB)
│   ├── config/                 # db.js (Mongoose connection)
│   ├── controllers/            # userController, productController, orderController
│   ├── middleware/             # authMiddleware (protect & admin), errorMiddleware
│   ├── models/                 # User.js, Product.js, Order.js
│   ├── routes/                 # userRoutes, productRoutes, orderRoutes, uploadRoutes
│   ├── uploads/                # Directory for uploaded product images
│   ├── .env                    # Environment configuration
│   ├── .env.example
│   ├── package.json
│   ├── seeder.js               # Initial database seeder script
│   └── server.js               # Main Express entry point
│
├── .gitignore
├── package.json                # Root package with unified scripts
└── README.md
```

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB Atlas** account (or local MongoDB server)

---

### 2. Configure MongoDB Online (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create or open your cluster.
2. In **Network Access**, ensure your IP or `0.0.0.0/0` is allowed.
3. In **Database Access**, create a database user (e.g., username & password).
4. Click **Connect ➔ Drivers (Node.js)** and copy your connection string.
5. Open `server/.env` and replace `MONGODB_URI` with your connection string:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/amazon_ecommerce?retryWrites=true&w=majority
JWT_SECRET=amazon_clone_jwt_secret_token_2026_xyz
NODE_ENV=development
```

---

### 3. Seed Sample Data (Products & Users)
Run the seeder script to populate your database with realistic Amazon products and test accounts:

```bash
# From the project root:
npm run seed

# Or from the server directory:
cd server
node seeder.js
```

---

### 4. Running the Application

Open two terminal windows (or run commands from root):

#### **Terminal 1: Start Backend Server**
```bash
# Option A: From root directory
npm run server

# Option B: From server directory
cd server
npm run dev
```
> Server runs on `http://localhost:5000`

#### **Terminal 2: Start Frontend Client**
```bash
# Option A: From root directory
npm run client

# Option B: From client directory
cd client
npm run dev
```
> Client runs on `http://localhost:3000` (or `http://localhost:5173`)

---

## 🔑 Demo Test Accounts

You can test both roles using the buttons on the Login page or with these credentials:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@amazon.com` | `admin123` | Full access to **Admin Seller Central** (`/admin`), Product creation/editing/deletion, Order status updates, and User list. |
| **Customer** | `user@amazon.com` | `user123` | Browsing, Search, Filters, Cart, Checkout, Order Placement, and Order History (`/orders`). |

---

## 🌐 API Endpoints Reference

### **Authentication & Users (`/api/users`)**
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Authenticate user & get JWT token
- `GET /api/users/profile` - Get logged-in user profile (*Protected*)
- `PUT /api/users/profile` - Update user profile (*Protected*)
- `GET /api/users` - Get all users (*Admin only*)

### **Products (`/api/products`)**
- `GET /api/products` - Fetch products (supports `keyword`, `category`, `minPrice`, `maxPrice`, `rating`, `sortBy`, `page`, `limit`)
- `GET /api/products/categories` - Fetch unique categories with count
- `GET /api/products/featured` - Fetch deals and featured items
- `GET /api/products/:id` - Fetch single product details
- `POST /api/products` - Create new product (*Admin only*)
- `PUT /api/products/:id` - Update existing product (*Admin only*)
- `DELETE /api/products/:id` - Delete product (*Admin only*)

### **Orders (`/api/orders`)**
- `POST /api/orders` - Place new order (*Protected*)
- `GET /api/orders/myorders` - Get current user's order history (*Protected*)
- `GET /api/orders/:id` - Get order receipt (*Protected*)
- `PUT /api/orders/:id/cancel` - Cancel order (*Protected*)
- `GET /api/orders` - View all customer orders (*Admin only*)
- `PUT /api/orders/:id/status` - Update status to *Pending, Processing, Delivered, Cancelled* (*Admin only*)

### **File Upload (`/api/upload`)**
- `POST /api/upload` - Upload product image via Multer (*Admin only*)

---

## 📤 Push Code to GitHub

To push this complete project to your GitHub repository:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage and commit all files
git add .
git commit -m "feat: complete Amazon.in E-Commerce clone with client, server, and admin panel"

# 3. Rename branch to main
git branch -M main

# 4. Add your GitHub repository link
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 5. Push to GitHub
git push -u origin main
```

---

## 📝 குறிப்பு (Tamil Notes for User)
- **Frontend**: `client` ஃபோல்டரில் React.js + Vite + Tailwind CSS கொண்டு முழுமையாக உருவாக்கப்பட்டுள்ளது.
- **Backend**: `server` ஃபோல்டரில் Node.js + Express.js + JWT + Multer கொண்டு REST API தயாராக உள்ளது.
- **Database**: `server/.env` கோப்பில் உள்ள `MONGODB_URI`யில் உங்கள் **MongoDB Atlas** ஆன்லைன் ஸ்ட்ரிங்கை கொடுத்து `npm run seed` கொடுத்தால் மாதிரி தரவுகள் (Sample Products & Users) உடனே லோட் ஆகிவிடும்.
- **Admin**: `admin@amazon.com` / `admin123` மூலமாக அட்மின் பேனலில் (`/admin`) புதிய பொருட்கள் சேர்க்கலாம், மாற்றலாம், படங்கள் பதிவேற்றலாம் மற்றும் ஆர்டர் நிலையை மாற்றலாம்.
