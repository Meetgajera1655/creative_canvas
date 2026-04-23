# Creative Canvas — Premium eCommerce Platform

## 🗂️ Project Structure
```
├── client/               ← React frontend (port 3000)
│   ├── src/
│   │   ├── pages/        ← All page components
│   │   │   ├── Home.js
│   │   │   ├── Shop.js           (with sidebar filters)
│   │   │   ├── CreativeCanvas.js
│   │   │   ├── Kasab.js
│   │   │   ├── ProductDetails.js (reviews, delivery check, wishlist)
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js       (Razorpay + COD)
│   │   │   ├── Orders.js         (with status tracker)
│   │   │   ├── Wishlist.js       ← NEW
│   │   │   ├── Login.js / Signup.js / Account.js
│   │   │   ├── OrderSuccess.js
│   │   │   └── admin/            ← Admin panel
│   │   ├── components/
│   │   │   ├── layout/  Navbar, Footer, AdminLayout
│   │   │   └── common/  ProductCard (wishlist, hover quick-add, stock)
│   │   ├── context/      AuthContext, CartContext
│   │   ├── services/     api.js (all axios calls)
│   │   └── utils/        image.js (URL resolver + formatPrice)
│
└── server/               ← Node.js + Express (port 5000)
    ├── routes/
    │   ├── auth.js       login, signup, /me
    │   ├── products.js   CRUD + filters + search
    │   ├── cart.js       get, add, update, remove
    │   ├── orders.js     place, my orders, Razorpay, admin
    │   ├── reviews.js    submit, get, delete (admin)
    │   ├── search.js     live search
    │   ├── admin.js      stats, users, reviews
    │   ├── wishlist.js   toggle, get, check ← NEW
    │   └── upload.js     image upload
    ├── config/
    │   └── firebase.js   Admin SDK + CRUD helpers
    ├── middleware/
    │   └── auth.js       JWT + admin guard
    └── uploads/          ← Product images served here
```

## 🚀 Quick Start

### Step 1 — Fix Images (CRITICAL)
Your product photos are in the old EJS project. Copy them:
```bash
mkdir -p server/uploads
cp /path/to/creative_canvas_node/public/uploads/* server/uploads/
```
If you don't have the old project, images show a beautiful placeholder automatically.

### Step 2 — Server Setup
```bash
cd server
cp .env.example .env
# Fill in ADMIN_EMAIL, ADMIN_PASSWORD, and optionally Razorpay keys
npm install
npm start         # http://localhost:5000
```

### Step 3 — Client Setup
```bash
cd client
npm install
npm start         # http://localhost:3000
```

## ⚙️ Environment Setup

### server/.env (minimum required)
```
FIREBASE_DATABASE_URL=https://creative-canvas-26-default-rtdb.asia-southeast1.firebasedatabase.app
JWT_SECRET=any-strong-random-string
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Razorpay (for real payments)
1. Sign up at razorpay.com
2. Settings → API Keys → Generate Test Key
3. Add to .env:
```
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
```
**Note:** Without Razorpay keys, COD (Cash on Delivery) still works perfectly.

## 📱 All Working Routes

### Frontend (http://localhost:3000)
| Route | Description |
|-------|-------------|
| `/` | Home — hero, categories, featured, trending |
| `/shop` | All products with filters |
| `/creative-canvas` | Resin Art brand page |
| `/kasab` | Kasab embroidery brand page |
| `/product/:id` | Product detail, reviews, delivery check |
| `/cart` | Cart with animated updates |
| `/checkout` | Address + Razorpay/COD |
| `/order-success` | Confirmation page |
| `/orders` | Order history with status tracker |
| `/wishlist` | Saved items |
| `/account` | Profile & navigation hub |
| `/login` | Sign in |
| `/signup` | Create account |
| `/admin` | Dashboard with stats |
| `/admin/products` | Add/Edit/Delete products |
| `/admin/orders` | Manage orders + status |
| `/admin/reviews` | View/Delete reviews |
| `/admin/users` | Block/Unblock users |

### Backend API (http://localhost:5000)
All endpoints prefixed with `/api/`

| Endpoint | Method | Auth |
|----------|--------|------|
| `/auth/login` | POST | Public |
| `/auth/signup` | POST | Public |
| `/auth/me` | GET | JWT |
| `/products` | GET | Public |
| `/products/:id` | GET | Public |
| `/products` | POST/PUT/DELETE | Admin |
| `/cart` | GET/POST/PUT/DELETE | JWT |
| `/orders` | POST/GET | JWT |
| `/orders/admin/all` | GET | Admin |
| `/orders/:id/status` | PUT | Admin |
| `/reviews/:id` | GET | Public |
| `/reviews` | POST | JWT |
| `/search?q=` | GET | Public |
| `/wishlist` | GET | JWT |
| `/wishlist/toggle` | POST | JWT |
| `/admin/stats` | GET | Admin |
| `/admin/users` | GET/PUT | Admin |

## 🎨 UI Features
- **Glassmorphism navbar** with live search dropdown
- **Framer Motion animations** — fade-up, stagger, spring
- **Product cards** — hover zoom, quick-add, wishlist button, stock warnings
- **Amazon-style order tracker** with progress bar
- **Delivery PIN check** on product detail page
- **Animated cart** — items animate in/out
- **Star rating input** with hover preview
- **Mobile drawer** with overlay for navigation
- **Skeleton-ready CSS** for loading states
- **CSS custom properties** for easy theming

