// Authentication functionality

// Toast notification functions are now centralized in utils.js

document.addEventListener('DOMContentLoaded', function() {
  console.log('Volink auth.js loaded');
  
  // Clear any cached data on page load to ensure clean state
  if (window.userDataCache) {
    window.userDataCache = null;
  }
  if (window.eventsCache) {
    window.eventsCache = null;
  }
  
  // Handle logout parameter - clear Firebase persistence
  if (window.location.search.includes('logout=true')) {
    console.log('Logout parameter detected, clearing Firebase persistence');
    auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
      .then(() => {
        console.log('Firebase persistence cleared');
        // Remove logout parameter from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      })
      .catch((error) => {
        console.error('Error clearing persistence:', error);
      });
  }

  // Check if user is already logged in - only on auth pages
  if (window.location.pathname.includes('login.html') || 
      window.location.pathname.includes('register.html') ||
      window.location.pathname.includes('dashboard.html') ||
      window.location.pathname.includes('profile.html') ||
      window.location.pathname.includes('event-detail.html')) {
    
    // Wait for Firebase to initialize
    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log('User is logged in:', user.email);
        // Redirect to dashboard if on auth pages
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('register.html')) {
          window.location.href = 'dashboard.html';
        }
      } else {
        console.log('User is logged out');
        // Redirect to login if on protected pages
        if (window.location.pathname.includes('dashboard.html') || 
            window.location.pathname.includes('profile.html') ||
            window.location.pathname.includes('event-detail.html')) {
          window.location.href = 'login.html';
        }
      }
    });
  }

  // Login form functionality
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    // Setup real-time validation
    setupRealTimeValidation('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form using enhanced validation
      if (!validateForm('loginForm')) {
        return;
      }
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errorMsg = document.getElementById('loginError');
      
      // Clear previous error
      errorMsg.textContent = '';
      
      // Show loading toast
      const loadingToast = showInfoToast('Signing you in...', 'Signing In');
      
      // Login with email/password
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('Login successful');
          dismissToast(loadingToast);
          showSuccessToast('Login successful! Redirecting...', 'Welcome Back');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1500);
        })
        .catch((error) => {
          console.error('Login error:', error);
          dismissToast(loadingToast);
          let errorMessage = 'Login failed. Please try again.';
          
          switch (error.code) {
            case 'auth/user-not-found':
              errorMessage = 'No account found with this email address.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Incorrect password. Please try again.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Please enter a valid email address.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Too many failed attempts. Please try again later.';
              break;
          }
          
          showErrorToast(errorMessage, 'Login Failed');
          errorMsg.textContent = errorMessage;
        });
    });
  }

  // Google login functionality
  const googleLoginBtn = document.getElementById('googleLogin');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', function() {
      const provider = new firebase.auth.GoogleAuthProvider();
      
      auth.signInWithPopup(provider)
        .then((result) => {
          console.log('Google login successful');
          // Check if user exists in Firestore, if not create profile
          checkAndCreateUserProfile(result.user);
        })
        .catch((error) => {
          console.error('Google login error:', error);
          const errorMsg = document.getElementById('loginError');
          if (errorMsg) errorMsg.textContent = 'Google sign-in temporarily disabled. Please use email/password registration.';
        });
    });
  }

  // User type selection functionality
  const userTypeInputs = document.querySelectorAll('input[name="userType"]');
  const formFields = document.getElementById('formFields');
  
  if (userTypeInputs.length > 0) {
    userTypeInputs.forEach(input => {
      input.addEventListener('change', function() {
        if (formFields) {
          formFields.style.display = 'block';
        }
      });
    });
  }

  // Register form functionality
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    // Setup real-time validation
    setupRealTimeValidation('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const userType = document.querySelector('input[name="userType"]:checked');
      if (!userType) {
        const errorMsg = document.getElementById('registerError');
        errorMsg.textContent = 'Please select an account type';
        return;
      }
      
      // Validate form using enhanced validation
      if (!validateForm('registerForm')) {
        return;
      }
      
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const errorMsg = document.getElementById('registerError');
      
      // Clear previous error
      errorMsg.textContent = '';
      
      // Show loading toast
      const loadingToast = showInfoToast('Creating your account...', 'Creating Account');
      
      // Create user with email/password
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('Registration successful');
          dismissToast(loadingToast);
          showSuccessToast('Account created successfully! Setting up your profile...', 'Account Created');
          // Create user profile in Firestore with selected role
          createUserProfile(userCredential.user, name, userType.value);
        })
        .catch((error) => {
          console.error('Registration error:', error);
          dismissToast(loadingToast);
          let errorMessage = 'Registration failed. Please try again.';
          
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'An account with this email already exists.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Please enter a valid email address.';
              break;
            case 'auth/weak-password':
              errorMessage = 'Password should be at least 6 characters long.';
              break;
          }
          
          showErrorToast(errorMessage, 'Registration Failed');
          errorMsg.textContent = errorMessage;
        });
    });
  }

  // Google register functionality
  const googleRegisterBtn = document.getElementById('googleRegister');
  if (googleRegisterBtn) {
    googleRegisterBtn.addEventListener('click', function() {
      const userType = document.querySelector('input[name="userType"]:checked');
      if (!userType) {
        const errorMsg = document.getElementById('registerError');
        errorMsg.textContent = 'Please select an account type first';
        return;
      }
      
      const provider = new firebase.auth.GoogleAuthProvider();
      
      auth.signInWithPopup(provider)
        .then((result) => {
          console.log('Google registration successful');
          // Check if user exists in Firestore, if not create profile with selected role
          checkAndCreateUserProfile(result.user, userType.value);
        })
        .catch((error) => {
          console.error('Google registration error:', error);
          const errorMsg = document.getElementById('registerError');
          if (errorMsg) errorMsg.textContent = 'Google sign-in temporarily disabled. Please use email/password registration.';
        });
    });
  }

  // Logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Clear any cached data
      if (window.userDataCache) {
        window.userDataCache = null;
      }
      if (window.eventsCache) {
        window.eventsCache = null;
      }
      
      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Show loading toast
      const loadingToast = showInfoToast('Signing you out...', 'Signing Out');
      
      auth.signOut()
        .then(() => {
          console.log('Logout successful - cleared all cache and storage');
          dismissToast(loadingToast);
          showSuccessToast('Logged out successfully!', 'Goodbye');
          setTimeout(() => {
            // Force a clean redirect to login page
            window.location.replace('login.html?logout=true');
          }, 1000);
        })
        .catch((error) => {
          console.error('Logout error:', error);
          dismissToast(loadingToast);
          showErrorToast('Error signing out. Please try again.', 'Logout Failed');
        });
    });
  }

  // Password reset functionality
  const forgotPasswordBtn = document.getElementById('forgotPassword');
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const errorMsg = document.getElementById('loginError');
      
      if (!email) {
        errorMsg.textContent = 'Please enter your email address first';
        return;
      }
      
      // Show loading toast
      const loadingToast = showInfoToast('Sending reset email...', 'Password Reset');
      
      // Send password reset email
      auth.sendPasswordResetEmail(email)
        .then(() => {
          errorMsg.textContent = '';
          dismissToast(loadingToast);
          showSuccessToast('Password reset email sent! Check your inbox.', 'Reset Email Sent');
        })
        .catch((error) => {
          console.error('Password reset error:', error);
          dismissToast(loadingToast);
          let errorMessage = 'Error sending reset email. Please try again.';
          
          switch (error.code) {
            case 'auth/user-not-found':
              errorMessage = 'No account found with this email address.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Please enter a valid email address.';
              break;
          }
          
          showErrorToast(errorMessage, 'Reset Failed');
          errorMsg.textContent = errorMessage;
        });
    });
  }
});

// Helper function to create user profile in Firestore
function createUserProfile(user, name, role = 'volunteer') {
  const userData = {
    name: name,
    email: user.email,
    role: role,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    bio: '',
    skills: [],
    interests: [],
    history: []
  };

  // Add role-specific fields
  if (role === 'ngo') {
    userData.mission = '';
    userData.phone = '';
    userData.location = '';
  } else {
    userData.location = '';
    userData.phone = '';
  }

  db.collection('users').doc(user.uid).set(userData)
    .then(() => {
      console.log('User profile created with role:', role);
      showSuccessToast('Profile setup complete! Welcome to Volink.', 'Profile Created');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    })
    .catch((error) => {
      console.error('Error creating user profile:', error);
      showErrorToast('Error setting up profile. Please try again.', 'Profile Setup Failed');
    });
}

// Helper function to check if user profile exists and create if needed
function checkAndCreateUserProfile(user, role = 'volunteer') {
  db.collection('users').doc(user.uid).get()
    .then((doc) => {
      if (!doc.exists) {
        // User doesn't exist in Firestore, create profile
        const userData = {
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          role: role,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          bio: '',
          skills: [],
          interests: [],
          history: []
        };

        // Add role-specific fields
        if (role === 'ngo') {
          userData.mission = '';
          userData.phone = '';
          userData.location = '';
        } else {
          userData.location = '';
          userData.phone = '';
        }

        return db.collection('users').doc(user.uid).set(userData);
      }
    })
    .then(() => {
      console.log('User profile checked/created with role:', role);
      showSuccessToast('Profile setup complete! Welcome to Volink.', 'Profile Created');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    })
    .catch((error) => {
      console.error('Error checking/creating user profile:', error);
      showErrorToast('Error setting up profile. Please try again.', 'Profile Setup Failed');
    });
} 