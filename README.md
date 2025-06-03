# 📝 Blog Management System (GBLOG)

A full-stack MERN (MongoDB, Express.js, React, Node.js) blog platform built as a technical test submission for the PIF Full-Stack Developer position.

## 📁 Folder Structure

- `blog-client/` – React frontend using Tailwind CSS, Radix UI, and React Router
- `blog-server/` – Node.js backend with Express and MongoDB

---

## 🚀 Features

### 🔐 Authentication

- Standard **email/password** login and registration with:
  - reCAPTCHA v2 (checkbox) verification
  - JWT-based session authentication
  - Validation feedback (invalid email, short password, etc.)

- **Google OAuth 2.0**
  - Seamless login/register via Google
  - Profile logic disables password reset for Google-based accounts

- **Forgot Password Flow**
  - reCAPTCHA verification
  - Sends reset link to email
  - Validates new password inputs
  - Frontend handles all error/success states clearly

### 🔒 2FA (Two-Factor Authentication)

- Prompt to enable 2FA after login
- Generates QR code (TOTP-compatible, e.g., Google Authenticator)
- Input 6-digit code to activate
- Backend stores and verifies TOTP secrets
- "2FA setup complete" feedback shown on success

---

## 🧾 Blog Management

### ✍️ Create Blog

- Title (min 3 characters), content (min 10 characters), and author required
- Shows validation errors
- Confirmation toast on success

### 📝 Edit Blog

- Pre-fills data
- Updates blog content and timestamps
- Confirmation toast on update

### 🗑 Delete Blog

- Deletes blog from user list
- Confirmation toast on deletion

### 📋 View Blogs

- **Latest Blogs Page** (public)
  - Shows all blog cards with author, date, and preview content
- **My Blogs Page** (authenticated)
  - Table with title, author, timestamps, actions
  - Edit / Delete available per blog

---

## 👤 User Profile Page

- Shows **username** and **email**
- Option to **change password** (unless using Google account)
  - Requires current password
  - Validates new password length
  - Confirms password match
  - Ensures new ≠ current password
  - Shows relevant toasts and errors

---

## ✅ UX Details

- Toasts on all actions (success/failure)
- Form validations with user-friendly messages
- Responsive layout
- Protected routes and redirects
- Custom branding with logo and color scheme

---

## 🖼 Screenshots

- ✅ Login (with and without Google)
- ✅ Registration with validation
- ✅ reCAPTCHA-protected password reset
- ✅ TOTP-based 2FA setup with QR
- ✅ Create, edit, delete blog
- ✅ Profile view and password change
- ✅ Blog post full view and public access

---

## 👨‍💻 Developer Note

> © 2025 | Designed & Developed by: **Developer Ghaid 💗**

---

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Radix UI, React Router
- **Backend**: Node.js, Express.js, MongoDB, JWT, speakeasy (2FA), Nodemailer
- **Security**: Google reCAPTCHA v2, TOTP 2FA, bcrypt hashing
- **Auth**: JWT-based tokens + Google OAuth

---

## 📌 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/blog-management-system.git

# Navigate to backend and install
cd blog-server
npm install
npm start

# Navigate to frontend and install
cd ../blog-client
npm install
npm start
