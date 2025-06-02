
# 📝 Blog Management System

A full-stack MERN (MongoDB, Express, React, Node.js) blog platform built as a technical test submission for the PIF Full-Stack Developer position.

---

## 📁 Folder Structure

- `blog-client/`: React frontend using Tailwind and CSS
- `blog-server/`: Node.js/Express backend with MongoDB integration

---

## 🚀 Features

### 🔐 Authentication & Security

- JWT-based login and registration
- Google OAuth 2.0 integration
- Forgot password via email reset
- reCAPTCHA v2 (Checkbox) to prevent bot abuse
- Time-Based One-Time Password (TOTP) 2FA (Google Authenticator)

### 📰 Blog Management

- Create, edit, delete blog posts
- View all posts and individual post details

### 💡 User Experience

- Responsive layout with modern and minimal UI
- Conditional navigation based on auth status
- Profile management with secure password update
- Toast notifications with clean positioning and muted styling

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Radix UI, React Hook Form, Zod
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Authentication**: JWT, bcrypt, Google OAuth, reCAPTCHA, TOTP (2FA)
- **Email Service**: Mailtrap SMTP
- **Others**: React Toastify, Moment.js

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/gh99ed/pif-blog-app.git
cd pif-blog-app
```

### 2. Backend Setup

```bash
cd blog-server
npm install
cp .env.example .env
# Fill in the environment variables
npm start
```

### 3. Frontend Setup

```bash
cd blog-client
npm install
cp .env.example .env
# Fill in the environment variables
npm start
```

---

## 🌐 Environment Variables

### ✅ Backend (`blog-server/.env.example`)
```env
PORT=
MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
EMAIL_FROM=
RECAPTCHA_SECRET_KEY=
```

### ✅ Frontend (`blog-client/.env.example`)
```env
REACT_APP_API_BASE_URL=
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_RECAPTCHA_SITE_KEY=
```

---

## 🧪 Testing Notes

- All key flows (login, signup, 2FA, password reset, blog CRUD) tested
- reCAPTCHA tested for invalid and expired tokens
- Mailtrap integration tested using email preview
- Responsive on all devices

---

## 📄 License

This project is intended solely for technical evaluation purposes.
