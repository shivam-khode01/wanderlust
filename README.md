# 🌍 Wanderlust

**Wanderlust** is a full-stack travel booking web application that allows users to explore, list, and book travel accommodations with ease. Built using the **MERN** (MongoDB, Express, Node.js) stack and enhanced with authentication, image uploads, and real-time data handling, Wanderlust demonstrates a robust understanding of both frontend and backend development, RESTful APIs, security, and cloud services.

🔗 **Live Application**: [https://wanderlust-y7mj.onrender.com/listing](https://wanderlust-y7mj.onrender.com/listing)

---

## 📌 Project Highlights

* 🌐 **Fully Deployed**: Live on [Render](https://render.com/)
* 🔐 **Authentication**: Built-in registration and login system using secure session handling
* 🔏 **Authorization**: Users can only modify their own listings or reviews
* 📸 **Cloudinary Integration**: Upload and manage images in the cloud
* 🧠 **Middleware & Validation**: Modular route protection and schema validation with JOI
* 🧰 **MVC Architecture**: Clean code separation with Controllers, Routes, and Models
* 🎨 **Dynamic EJS Templates**: Server-side rendering with user-friendly UI

---

## 🛠️ Tech Stack

| Technology          | Purpose                           |
| ------------------- | --------------------------------- |
| **Node.js**         | Runtime environment               |
| **Express.js**      | Web framework for Node            |
| **MongoDB**         | NoSQL database                    |
| **Mongoose**        | MongoDB object modeling           |
| **EJS**             | Server-side rendering templates   |
| **Cloudinary**      | Image hosting and transformations |
| **Helmet**          | Security middleware               |
| **Method-Override** | RESTful method support in forms   |
| **Express-Session** | Session management                |

---

## ✨ Features Overview

### 👥 User System

* Register, login, logout with secure session-based authentication
* Passwords hashed using `bcryptjs`
* Session persistence using cookies

### 🏨 Listings

* Add/edit/delete listings
* Upload multiple images using Cloudinary
* Listings stored in MongoDB with geolocation and pricing metadata

### 💬 Reviews

* Users can review listings
* Only logged-in users can post reviews
* Review deletion restricted to review authors

### ⚙️ Admin Logic

* Authorization checks for editing/deleting only if current user is owner
* Flash messages for success/error notifications

---

## 📂 Folder Structure

```
wanderlust/
├── controllers/         # Business logic
├── init/                # DB seed/init scripts
├── models/              # Mongoose schemas (User, Listing, Review)
├── routes/              # Express route definitions
├── public/              # Static files (CSS, JS)
├── views/               # EJS templates
├── middleware.js        # Custom auth & validation middleware
├── cloudConfig.js       # Cloudinary setup
├── schema.js            # JOI validation schemas
├── app.js               # Entry point
└── .env                 # Environment variables
```

---

## 🚀 Installation & Setup

### 📋 Prerequisites

* Node.js, npm
* MongoDB instance (local or Atlas)
* Cloudinary account

### 📦 Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/shivam-khode01/wanderlust.git
   cd wanderlust
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory**

   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_random_session_secret
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Visit the app at**
   `http://localhost:3000/listing`

---

## 🧑‍💼 Why This Project Matters

This project reflects my practical skills in:

* Designing secure, user-focused web apps with full CRUD capabilities
* Implementing authentication & authorization using Express middleware
* Architecting scalable applications with MVC structure
* Managing cloud storage and deployment pipelines
* Creating clean, maintainable code following industry standards

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---


## 📧 Contact

**Shivam Khonde**
📧 [shivamkhonde@gmail.com](mailto:shivamkhode04@gmail.com)
🔗 [GitHub Profile](https://github.com/shivam-khode01)
