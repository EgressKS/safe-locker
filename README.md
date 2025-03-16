# Safelocker

Safelocker is a secure and encrypted storage application that enables users to store and manage sensitive information like passwords, contacts, media, documents, and confidential notes. It ensures top-tier security with encryption, authentication, and cloud backup options.

## 🚀 Features

- **🔐 Password Management** – Securely store and manage passwords for Gmail, social media, gaming, and more.
- **📞 Contact Storage** – Save and protect important phone numbers.
- **🖼️ Media & Document Storage** – Upload, encrypt, and manage photos, videos, and documents.
- **📝 Secret Notes** – Write and encrypt confidential notes.
- **🛡️ Secure Encryption** – AES-256 encryption for data at rest and in transit.
- **🔑 User Authentication** – JWT-based authentication for secure access.
- **☁️ Cloud Backup (Optional)** – Sync and access data across multiple devices.
- **🔍 Search & Organization** – Easily search, categorize, and retrieve stored data.

---

## 🏗 Tech Stack

- **Mobile App:** React Native (Expo)
- **Backend:** Node.js, Express.js
- **Database:** MySQL + MongoDB + Redis (for caching)
- **Authentication:** JSON Web Tokens (JWT)
- **File Storage:** Cloudinary (for media storage)
- **Encryption:** AES-256 encryption for securing user data

---

## 📌 Installation Guide

### Prerequisites

Ensure you have the following installed on your system:

- Node.js
- MySQL
- MongoDB
- Redis (recommended for caching)

### 🔧 Setup Instructions

1. **Clone the repository:**

   ```sh
   git clone https://github.com/EgressKS/safe-locker.git
   cd Safelocker
   ```

2. **Install dependencies:**

   ```sh
   cd backend  
   npm install  
   cd ../mobile-app  
   npm install  
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following:

   ```sh
   MONGODB_URI=your_mongodb_connection_string
   MYSQL_HOST=your_mysql_host
   MYSQL_USER=your_mysql_user
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=your_mysql_database
   JWT_SECRET=your_jwt_secret_key
   REDIS_HOST=your_redis_host
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the backend server:**

   ```sh
   cd backend  
   npm run dev  
   ```

5. **Start the mobile app (React Native with Expo):**

   ```sh
   cd client  
   npm install  
   npm run dev 
   ```

---

## 📂 GitHub Repository Structure

```sh
safe-locker/
│── backend/       # Node.js & Express backend
│── client/    # React Native app using Expo
│── README.md      # Project documentation
```

---

## 🤝 Contributing

We welcome contributions! Feel free to submit issues, feature requests, or contribute via pull requests.

---

## 📜 License

This project is licensed under the **Apache License 2.0**.

---

## 👤 Author

**Krishna Sumit**\
If you find this project useful, consider giving it a ⭐ on GitHub!

