# 🎉 GreetMe — Custom Greetings & Wishes App

A full-stack MERN application that lets users create personalized greeting cards with their **profile photo and name automatically overlaid** on beautiful templates.

---

## 📱 Features

- **Authentication** — Email/password signup, guest login, Google (ready to configure)
- **Home Feed** — Categorized templates grid (Birthday, Anniversary, Festival, Love, Shayari, etc.)
- **Live Canvas Preview** — Profile picture + name auto-overlaid on every template in real time using HTML5 Canvas
- **Premium System** — Free vs. Premium templates, subscription modal (Monthly ₹99 / Yearly ₹799)
- **Share & Download** — Native share sheet (WhatsApp, Instagram, Email), HD PNG download
- **Profile Management** — Update name, upload profile picture

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, react-hot-toast |
| Styling | Pure CSS with CSS Variables (dark theme) |
| Canvas | HTML5 Canvas API (image overlay logic) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| File Upload | Multer |
| Image Processing | Sharp |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/greetme-app.git
cd greetme-app
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/greetings_app
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Run the App

In two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

App opens at **http://localhost:3000**

### 4. Seed Templates

Templates are auto-seeded on first API call to `/api/templates/seed`. Or call it manually:
```bash
curl -X POST http://localhost:5000/api/templates/seed
```

---

## 📁 Project Structure

```
greetings-app/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # authController, templateController, userController, subscriptionController
│   ├── middleware/     # JWT auth, multer upload
│   ├── models/         # User, Template (Mongoose schemas)
│   ├── routes/         # auth, templates, users, subscriptions
│   ├── uploads/        # Uploaded images (gitignored)
│   └── server.js       # Express entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Card/       # TemplateCard (Canvas), ShareModal
        │   ├── Home/       # CategoryBar
        │   ├── Premium/    # PremiumModal
        │   └── Shared/     # Navbar, LoadingScreen
        ├── context/        # AuthContext (global user state)
        └── pages/          # LoginPage, HomePage, ProfilePage
```

---

## 🎨 Image Overlay Logic

The core personalization uses **HTML5 Canvas API**:

1. Load background template image onto `<canvas>`
2. If premium-locked, draw a semi-transparent overlay
3. Draw user's **profile picture** as a circular clip at configured `(x, y)` position
4. Add a **green border ring** around the avatar
5. Draw a **dark banner** behind the name area for readability
6. Render the **user's name** as centered text with configured font size/color
7. Export canvas with `canvas.toDataURL('image/png')` for sharing/download

Each template stores overlay coordinates as percentages, making it resolution-independent.

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Email login |
| POST | `/api/auth/guest` | Guest login |
| GET | `/api/auth/me` | Get current user |

### Templates
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/templates` | List templates (with category & search filter) |
| GET | `/api/templates/categories` | Get all categories |
| POST | `/api/templates/seed` | Seed sample templates |
| POST | `/api/templates/:id/download` | Increment download count |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update name/photo |

### Subscriptions
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/subscriptions/plans` | Get plans |
| POST | `/api/subscriptions/activate` | Activate subscription |
| GET | `/api/subscriptions/status` | Check status |

---

## 📹 Demo Flow

1. **Login** → Email/Password or Guest
2. **Home** → Browse categorized templates with your photo + name live on each card
3. **Premium Popup** → Click a locked template → subscription modal
4. **Share** → Tap any free template → ShareModal with Download/WhatsApp/Email
5. **Profile** → Update name & photo (reflects on all cards instantly)

---

## 🔮 Future Improvements

- **Google OAuth** — Passport.js integration (endpoint scaffolded)
- **Text customization** — Let users edit the greeting message
- **Sticker/emoji overlays** — Additional decoration layers
- **Template CMS** — Admin panel to manage templates
- **Push notifications** — Remind users of upcoming occasions
- **PWA** — Offline support, install to home screen
- **CDN** — Cloudinary/S3 for image storage at scale
- **React Native** — Mobile app using this same backend

---

## 📄 License

MIT — Free to use and modify.
