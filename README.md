# FileVault

A full-stack cloud file storage app built with React, Node.js, MongoDB, and Firebase Storage.

## Features
- User registration and login (JWT-based authentication)
- Secure file upload, download, and deletion
- Profile management with profile photo
- Storage usage tracking
- Responsive, modern UI (Tailwind CSS)

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Firebase Storage

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas or local MongoDB
- Firebase project with service account JSON

### Clone the Repository
```sh
git clone https://github.com/JatinSihag/FileVault.git
cd FileVault
```

### Backend Setup
1. `cd backend`
2. Create a `.env` file with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
3. Place your Firebase service account JSON in `backend/` and update `firebase.config.js` if needed.
4. Install dependencies:
   ```sh
   npm install
   ```
5. Start the backend:
   ```sh
   npm start
   ```

### Frontend Setup
1. `cd frontend`
2. Create a `.env` file with:
   ```env
   VITE_API_URL=http://localhost:3333
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```


## Security Notes
- **Never commit `.env` or service account JSON files.**
- **Hash passwords before storing in production!** (Currently, passwords are stored in plaintext.)


