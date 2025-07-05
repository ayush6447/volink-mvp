// Profile management functionality

// Toast notification functions are now centralized in utils.js

// Skeleton Loading Functions for Profile
function showSkeletonLoading(container, type = 'profile') {
  container.innerHTML = '';
  
  switch(type) {
    case 'profile':
      showProfileSkeleton(container);
      break;
    default:
      showGenericSkeleton(container);
  }
}

function showProfileSkeleton(container) {
  const skeletonHTML = `
    <div class="skeleton-profile-card">
      <div class="skeleton-profile-header">
        <div class="skeleton-profile-avatar"></div>
        <div class="skeleton-profile-info">
          <div class="skeleton-profile-name"></div>
          <div class="skeleton-profile-role"></div>
        </div>
      </div>
      <div class="skeleton-profile-form">
        ${Array(6).fill().map(() => `
          <div class="skeleton-form-group">
            <div class="skeleton-form-label"></div>
            <div class="skeleton-form-input"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  container.innerHTML = skeletonHTML;
}

function showGenericSkeleton(container) {
  const skeletonHTML = `
    <div class="skeleton-container">
      ${Array(3).fill().map(() => `
        <div class="skeleton-card">
          <div class="skeleton-header">
            <div class="skeleton-avatar"></div>
            <div>
              <div class="skeleton-title"></div>
              <div class="skeleton-subtitle"></div>
            </div>
          </div>
          <div class="skeleton-content">
            <div class="skeleton-line long"></div>
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  container.innerHTML = skeletonHTML;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('Volink profile.js loaded');

  // Check authentication state
  auth.onAuthStateChanged(function(user) {
    if (user) {
      console.log('User logged in:', user.email);
      loadUserProfile(user.uid);
    } else {
      console.log('User logged out');
      window.location.href = 'login.html';
    }
  });

  // Handle profile form submission
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    // Setup real-time validation
    setupRealTimeValidation('profileForm');
    
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form using enhanced validation
      if (!validateForm('profileForm')) {
        return;
      }
      
      saveProfileChanges();
    });
  }

  // Handle image upload
  const imageUpload = document.getElementById('imageUpload');
  if (imageUpload) {
    imageUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      console.log('File selected:', file);
      if (file) {
        uploadProfileImage(file);
      }
    });
  }


});

// Load user profile data
function loadUserProfile(userId) {
  // Show skeleton loading
  const profileContainer = document.querySelector('.profile-container');
  if (profileContainer) {
    showSkeletonLoading(profileContainer, 'profile');
  }
  
  db.collection('users').doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        console.log('Profile data loaded:', userData);
        populateProfileForm(userData);
      } else {
        console.log('No profile data found');
        // Create basic profile structure
        const user = auth.currentUser;
        if (user) {
          populateProfileForm({
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            role: 'volunteer',
            bio: '',
            skills: [],
            interests: [],
            phone: '',
            location: '',
            mission: '',
            bannerURL: ''
          });
        }
      }
    })
    .catch((error) => {
      console.error('Error loading profile:', error);
      showMessage('Error loading profile data', 'error');
    });
}

// Populate form with user data
function populateProfileForm(userData) {
  const {
    name = '',
    email = '',
    bio = '',
    skills = [],
    interests = [],
    role = 'volunteer',
    photoURL = '',
    phone = '',
    location = '',
    mission = '',
    bannerURL = ''
  } = userData;

  // Get current user's email from Firebase Auth
  const currentUser = auth.currentUser;
  const userEmail = currentUser ? currentUser.email : email;

  // Hide skeleton and show actual form
  const profileContainer = document.getElementById('profileContainer');
  const profileForm = document.getElementById('profileForm');
  if (profileContainer) {
    profileContainer.style.display = 'none';
  }
  if (profileForm) {
    profileForm.style.display = 'block';
  }

  // Set header info
  if (document.getElementById('profileNameHeader')) {
    document.getElementById('profileNameHeader').textContent = name || '';
  }
  if (document.getElementById('profileRoleBadge')) {
    document.getElementById('profileRoleBadge').textContent = (role === 'ngo' ? 'NGO' : 'Volunteer');
  }
  if (document.getElementById('profileEmailHeader')) {
    document.getElementById('profileEmailHeader').textContent = userEmail;
  }

  document.getElementById('profileName').value = name;
  document.getElementById('profileEmail').value = userEmail;
  document.getElementById('profileBio').value = bio;
  document.getElementById('profileSkills').value = Array.isArray(skills) ? skills.join(', ') : skills;
  document.getElementById('profileInterests').value = Array.isArray(interests) ? interests.join(', ') : interests;
  if (document.getElementById('profileRole')) {
    document.getElementById('profileRole').value = role === 'ngo' ? 'NGO' : 'Volunteer';
  }
  document.getElementById('profilePhone').value = phone;
  document.getElementById('profileLocation').value = location;
  if (role === 'ngo') {
    document.getElementById('ngoFields').style.display = '';
    document.getElementById('profileMission').value = mission;
    if (bannerURL && !bannerURL.includes('default-banner')) {
      const bannerPreview = document.getElementById('bannerPreview');
      bannerPreview.src = bannerURL;
      bannerPreview.style.display = 'block';
    }
  } else {
    document.getElementById('ngoFields').style.display = 'none';
  }
  // Set profile image
  const profileImage = document.getElementById('profileImage');
  if (photoURL && photoURL !== '') {
    profileImage.src = photoURL;
  } else {
    // Use a data URI for default avatar (more reliable than file path)
    profileImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMzMzIi8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjIwIiBmaWxsPSIjNjY2Ii8+CjxyZWN0IHg9IjQ1IiB5PSI5MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNjY2Ii8+Cjwvc3ZnPgo=';
  }
}

// Save profile changes
function saveProfileChanges() {
  const user = auth.currentUser;
  if (!user) {
    showErrorToast('Please log in to save changes');
    return;
  }
  const name = document.getElementById('profileName').value.trim();
  const bio = document.getElementById('profileBio').value.trim();
  const skills = document.getElementById('profileSkills').value.trim();
  const interests = document.getElementById('profileInterests').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const location = document.getElementById('profileLocation').value.trim();
  
  // Get the current user's role from the database (don't allow changing)
  const currentUser = auth.currentUser;
  if (!currentUser) {
    showErrorToast('Please log in to save changes');
    return;
  }
  
  // Show loading toast
  const loadingToast = showInfoToast('Saving your changes...', 'Saving Profile');
  
  // Get current user data to preserve role and photo URL
  db.collection('users').doc(currentUser.uid).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const role = userData.role || 'volunteer';
        const currentPhotoURL = userData.photoURL || '';
        let mission = '', bannerURL = '';
        if (role === 'ngo') {
          mission = document.getElementById('profileMission').value.trim();
          const bannerPreview = document.getElementById('bannerPreview');
          bannerURL = bannerPreview ? bannerPreview.src : '';
        }
        
        if (!name) {
          dismissToast(loadingToast);
          showErrorToast('Name is required', 'Validation Error');
          return;
        }
        
        const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];
        const interestsArray = interests ? interests.split(',').map(s => s.trim()).filter(s => s) : [];
        const updateData = {
          name, bio, skills: skillsArray, interests: interestsArray, role, phone, location,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Preserve existing photo URL if no new photo was uploaded
        if (currentPhotoURL && currentPhotoURL !== '') {
          updateData.photoURL = currentPhotoURL;
        }
        
        if (role === 'ngo') {
          updateData.mission = mission;
          if (bannerURL && !bannerURL.includes('default-banner.png')) updateData.bannerURL = bannerURL;
        }
        
        // Use set with merge option to handle both new and existing users
        return db.collection('users').doc(user.uid).set(updateData, { merge: true });
      } else {
        dismissToast(loadingToast);
        showErrorToast('User profile not found');
        return Promise.reject('User profile not found');
      }
    })
    .then(() => {
      console.log('Profile saved successfully');
      dismissToast(loadingToast);
      showSuccessToast('Profile saved successfully!', 'Profile Updated');
      if (window.location.pathname.includes('dashboard.html')) {
        setTimeout(() => { window.location.reload(); }, 1500);
      }
    })
    .catch((error) => {
      console.error('Error saving profile:', error);
      dismissToast(loadingToast);
      showErrorToast('Error saving profile. Please try again.', 'Save Failed');
    });
}

// Optimized image upload with compression and lazy loading
function uploadProfileImage(file) {
  const user = auth.currentUser;
  if (!user) {
    showMessage('Please log in to upload image', 'error');
    return;
  }

  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    showMessage('Please select an image file', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    showMessage('Image size should be less than 5MB', 'error');
    return;
  }

  console.log('Starting optimized image upload process...');
  showMessage('Processing image...', 'info');

  // Compress image before upload
  compressImage(file, 0.8, 800) // 80% quality, max 800px width
    .then((compressedFile) => {
      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = compressedFile.name.split('.').pop();
      const fileName = `profile_${timestamp}.${fileExtension}`;

      // Create immediate local preview
      const reader = new FileReader();
      let dataURL = '';
      
      reader.onload = function(e) {
        dataURL = e.target.result;
        console.log('Local preview created, compressed size:', dataURL.length);
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
          profileImage.src = dataURL;
          profileImage.style.display = 'block';
          console.log('Profile image updated in UI');
        }
      };
      reader.readAsDataURL(compressedFile);

      // Try Firebase upload with shorter timeout
      const storageRef = storage.ref();
      const imageRef = storageRef.child(`profile-images/${user.uid}/${fileName}`);

      console.log('Attempting Firebase upload with compressed image...');
      
      const uploadTask = imageRef.put(compressedFile);
      
      // Reduced timeout for faster fallback
      const uploadTimeout = setTimeout(() => {
        console.log('Upload timeout - using local storage');
        showMessage('Image saved locally (upload timed out)', 'info');
        if (dataURL) {
          console.log('Saving compressed dataURL to Firestore...');
          saveImageDataURL(dataURL, user.uid);
        }
      }, 3000); // Reduced to 3 seconds

      uploadTask
        .then((snapshot) => {
          clearTimeout(uploadTimeout);
          console.log('Upload successful');
          return snapshot.ref.getDownloadURL();
        })
        .then((downloadURL) => {
          console.log('Compressed image uploaded to Firebase:', downloadURL);
          
          // Update the profile image in UI with the Firebase URL
          const profileImage = document.getElementById('profileImage');
          if (profileImage) {
            profileImage.src = downloadURL;
            profileImage.style.display = 'block';
          }
          
          return db.collection('users').doc(user.uid).set({
            photoURL: downloadURL,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        })
        .then(() => {
          showMessage('Profile image updated successfully!', 'success');
        })
        .catch((error) => {
          clearTimeout(uploadTimeout);
          console.error('Error uploading to Firebase:', error);
          
          if (dataURL) {
            console.log('Firebase upload failed, saving compressed dataURL locally...');
            saveImageDataURL(dataURL, user.uid);
          } else {
            console.log('No dataURL available for fallback');
            showMessage('Error: Could not process image', 'error');
          }
          
          showMessage('Image saved locally (Firebase upload failed)', 'info');
        });
    })
    .catch((error) => {
      console.error('Error compressing image:', error);
      showMessage('Error processing image. Please try again.', 'error');
    });
}

// Image compression function
function compressImage(file, quality = 0.8, maxWidth = 800) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          // Create new file with compressed data
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          reject(new Error('Failed to compress image'));
        }
      }, file.type, quality);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Save image as data URL to Firestore
function saveImageDataURL(dataURL, userId) {
  console.log('saveImageDataURL called with dataURL length:', dataURL.length);
  
  // Update the profile image in UI immediately
  const profileImage = document.getElementById('profileImage');
  if (profileImage) {
    profileImage.src = dataURL;
    profileImage.style.display = 'block';
  }
  
  db.collection('users').doc(userId).set({
    photoURL: dataURL,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true })
  .then(() => {
    console.log('Image data URL saved to Firestore successfully');
    showMessage('Profile image saved successfully!', 'success');
  })
  .catch((error) => {
    console.error('Error saving image data URL:', error);
    showMessage('Error saving image. Please try again.', 'error');
  });
}

// Show message to user
function showMessage(message, type = 'info') {
  const messageElement = document.getElementById('profileMessage');
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.className = `success-msg ${type}-msg`;
    
    // Clear message after 5 seconds
    setTimeout(() => {
      messageElement.textContent = '';
      messageElement.className = 'success-msg';
    }, 5000);
  }
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    auth.signOut()
      .then(() => {
        console.log('Logout successful');
        window.location.href = 'index.html';
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  });
}

// Banner image upload
const bannerUpload = document.getElementById('bannerUpload');
if (bannerUpload) {
  bannerUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showMessage('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showMessage('Banner size should be < 5MB', 'error');
      return;
    }
    showMessage('Uploading banner...', 'info');
    const user = auth.currentUser;
    const storageRef = storage.ref();
    const bannerRef = storageRef.child(`ngo-banners/${user.uid}/${file.name}`);
    bannerRef.put(file)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((downloadURL) => {
        const bannerPreview = document.getElementById('bannerPreview');
        bannerPreview.src = downloadURL;
        bannerPreview.style.display = 'block';
        showMessage('Banner uploaded!', 'success');
      })
      .catch((error) => {
        showMessage('Error uploading banner', 'error');
      });
  });
} 