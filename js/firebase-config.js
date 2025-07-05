// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQD0uJdpj9RRaza8S2ILhsjJuQmmAJFhY",
  authDomain: "volink-ea687.firebaseapp.com",
  projectId: "volink-ea687",
  storageBucket: "volink-ea687.firebasestorage.app",
  messagingSenderId: "476414537032",
  appId: "1:476414537032:web:1cac628c626c7dd5d2577d",
  measurementId: "G-QZ6WLDQJ92"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log('Firebase initialized with volink-ea687 project'); 