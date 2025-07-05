# 🌐 Volink – Volunteer & NGO Platform

A modern web platform connecting volunteers with NGOs for meaningful impact.

## 🚀 Quick Start

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "volink"
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google sign-in
4. Enable Firestore Database:
   - Go to Firestore Database > Create database
   - Start in test mode
5. Get your config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click the web icon (</>) to add a web app
   - Copy the config object

### 2. Firebase Configuration ✅
Firebase is already configured with your volink-ea687 project in `js/firebase-config.js`.

### 3. Run Locally
Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

## 📁 Project Structure
```
volink-website/
├── index.html          # Landing page
├── login.html          # Login page
├── register.html       # Registration page
├── dashboard.html      # User dashboard
├── profile.html        # User profile
├── ngo.html           # NGO profile view
├── event.html         # Event details
├── css/
│   └── styles.css     # Main styles
├── js/
│   ├── auth.js        # Authentication logic
│   ├── firestore.js   # Database operations
│   ├── main.js        # Main app logic
│   ├── utils.js       # Utility functions
│   └── firebase-config.js # Firebase config
└── assets/
    ├── images/        # Image assets
    └── icons/         # Icon assets
```

## 🔧 Features Implemented
- ✅ Modern, responsive UI with dark theme
- ✅ Firebase Authentication (Email/Password + Google)
- ✅ User registration and login
- ✅ Protected routes (redirect if not logged in)
- ✅ User profile creation in Firestore
- ✅ Logout functionality

## 🚧 Next Steps
- [ ] Dashboard content (role-based)
- [ ] Profile editing
- [ ] Event creation and management
- [ ] Application system
- [ ] NGO functionality
- [ ] Deploy to Firebase Hosting

## 🎨 Design
- **Primary Color**: Royal Blue (#004AAD)
- **Accent Color**: Golden Yellow (#FFD700)
- **Background**: Dark (#121212)
- **Font**: Poppins (Google Fonts)

## 🔒 Security
Firestore security rules will be implemented to ensure:
- Users can only edit their own profiles
- NGOs can manage their own events
- Public read access for events and NGO profiles 