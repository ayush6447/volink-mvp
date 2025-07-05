// Event detail page functionality

// Toast notification functions are now centralized in utils.js

document.addEventListener('DOMContentLoaded', function() {
  console.log('Event detail page loaded');

  // Check authentication state
  auth.onAuthStateChanged(function(user) {
    if (user) {
      console.log('User logged in:', user.email);
      // Add a small delay to ensure DOM is fully ready
      setTimeout(() => {
        loadEventDetails();
      }, 100);
    } else {
      console.log('User logged out');
      window.location.href = 'login.html';
    }
  });

  // Handle application button
  const applyBtn = document.getElementById('applyBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', function() {
      applyToEvent();
    });
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
});

// Check if all required DOM elements are present
function checkRequiredElements() {
  const requiredElements = [
    'eventTitle', 'eventCategory', 'eventDescription', 'eventDateTime',
    'eventLocation', 'eventDuration', 'eventVolunteers', 'eventSkills',
    'eventTasks', 'organizerInfo'
  ];
  
  const missingElements = requiredElements.filter(id => !document.getElementById(id));
  
  if (missingElements.length > 0) {
    console.warn('Missing required elements:', missingElements);
    return false;
  }
  
  return true;
}

// Load event details from URL parameter
function loadEventDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  if (!eventId) {
    console.error('No event ID provided');
    document.body.innerHTML = '<p>Error: No event ID provided</p>';
    return;
  }

  console.log('Loading event details for ID:', eventId);

  db.collection('events').doc(eventId).get()
    .then((doc) => {
      if (doc.exists) {
        const event = doc.data();
        console.log('Event data loaded:', event);
        
        displayEventDetails(event, eventId);
        updateEventMetaBadges(event);
        displayOrganizerInfo(event);
        
        // Check application status for logged-in users
        const user = auth.currentUser;
        if (user) {
          checkApplicationStatus(eventId);
        }
      } else {
        console.error('Event not found');
        document.body.innerHTML = '<p>Event not found</p>';
      }
    })
    .catch((error) => {
      console.error('Error loading event:', error);
      document.body.innerHTML = '<p>Error loading event details</p>';
    });
}

// Display event details
function displayEventDetails(event, eventId) {
  const EVENT_CATEGORIES = {
    'education': { name: 'Education', icon: '📚', color: '#4CAF50' },
    'environment': { name: 'Environment', icon: '🌱', color: '#8BC34A' },
    'health': { name: 'Healthcare', icon: '🏥', color: '#F44336' },
    'community': { name: 'Community', icon: '🏘️', color: '#2196F3' },
    'animals': { name: 'Animal Welfare', icon: '🐾', color: '#FF9800' },
    'disaster': { name: 'Disaster Relief', icon: '🚨', color: '#E91E63' },
    'technology': { name: 'Technology', icon: '💻', color: '#9C27B0' },
    'arts': { name: 'Arts & Culture', icon: '🎨', color: '#FF5722' },
    'sports': { name: 'Sports', icon: '⚽', color: '#00BCD4' },
    'other': { name: 'Other', icon: '🤝', color: '#607D8B' }
  };

  // Helper function to safely set element content
  function safeSetElementContent(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = content;
    } else {
      // Only log warning if element is actually expected to exist
      if (['eventTitle', 'eventDescription', 'eventDateTime', 'eventLocation', 'eventDuration', 'eventVolunteers', 'eventSkills', 'eventTasks'].includes(elementId)) {
        console.warn(`Element with id '${elementId}' not found - this may indicate a DOM loading issue`);
      }
    }
  }

  // Helper function to safely set element HTML
  function safeSetElementHTML(elementId, html) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
    } else {
      // Only log warning if element is actually expected to exist
      if (['eventCategory'].includes(elementId)) {
        console.warn(`Element with id '${elementId}' not found - this may indicate a DOM loading issue`);
      }
    }
  }

  // Update page title
  document.title = `${event.title} – Volink`;

  // Display event title
  safeSetElementContent('eventTitle', event.title);

  // Display category
  const category = EVENT_CATEGORIES[event.category] || EVENT_CATEGORIES.other;
  const categoryHTML = `
    <span style="background: linear-gradient(135deg, ${category.color}20, ${category.color}40); color: ${category.color}; border: 1px solid ${category.color}30;">
      ${category.icon} ${category.name}
    </span>
  `;
  safeSetElementHTML('eventCategory', categoryHTML);

  // Display description
  safeSetElementContent('eventDescription', event.description);

  // Display date and time
  const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'TBD';
  safeSetElementContent('eventDateTime', eventDate);

  // Display location
  const location = event.location || 'Not specified';
  safeSetElementContent('eventLocation', location);

  // Display duration
  safeSetElementContent('eventDuration', event.duration || 'Not specified');

  // Display volunteers needed
  safeSetElementContent('eventVolunteers', `${event.volunteersNeeded || 1} volunteer(s)`);

  // Display skills required
  const skills = event.skills && event.skills.length > 0 ? event.skills.join(', ') : 'None specified';
  safeSetElementContent('eventSkills', skills);

  // Display tasks/what you'll do
  const tasks = event.tasks || event.description || 'Help with various tasks as needed';
  safeSetElementContent('eventTasks', tasks);

  // Update meta badges
  updateEventMetaBadges(event);

  // Show urgent badge if event is urgent
  if (event.urgent) {
    const urgentBadge = document.getElementById('eventUrgentBadge');
    if (urgentBadge) {
      urgentBadge.style.display = 'inline-block';
    }
  }
}

// Update event meta badges
function updateEventMetaBadges(event) {
  const dateBadge = document.getElementById('eventDateBadge');
  const locationBadge = document.getElementById('eventLocationBadge');
  
  if (dateBadge && event.date) {
    const eventDate = new Date(event.date);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      dateBadge.textContent = '📅 Past event';
    } else if (diffDays === 0) {
      dateBadge.textContent = '📅 Today';
    } else if (diffDays === 1) {
      dateBadge.textContent = '📅 Tomorrow';
    } else if (diffDays <= 7) {
      dateBadge.textContent = `📅 ${diffDays} days away`;
    } else {
      dateBadge.textContent = `📅 ${eventDate.toLocaleDateString()}`;
    }
  } else if (dateBadge) {
    dateBadge.textContent = '📅 Date TBD';
  }
  
  if (locationBadge && event.location) {
    const isRemote = event.location.toLowerCase().includes('remote');
    locationBadge.textContent = isRemote ? '🌐 Remote' : `📍 ${event.location}`;
  } else if (locationBadge) {
    locationBadge.textContent = '📍 Location TBD';
  }
}

// Check if user has already applied
function checkApplicationStatus(eventId) {
  const user = auth.currentUser;
  if (!user) return;

  db.collection('users').doc(user.uid).get()
    .then((userDoc) => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        const applications = userData.applications || [];
        const hasApplied = applications.some(app => app.eventId === eventId);
        
        const applyBtn = document.getElementById('applyBtn');
        const appliedBtn = document.getElementById('appliedBtn');
        const applicationStatus = document.getElementById('applicationStatus');
        
        if (hasApplied) {
          if (applyBtn) applyBtn.style.display = 'none';
          if (appliedBtn) appliedBtn.style.display = 'block';
          if (applicationStatus) {
            applicationStatus.innerHTML = `
              <div style="color: #4CAF50; font-weight: 600;">
                ✅ You have already applied to this event
              </div>
            `;
          }
        } else {
          if (applyBtn) applyBtn.style.display = 'block';
          if (appliedBtn) appliedBtn.style.display = 'none';
          if (applicationStatus) {
            applicationStatus.innerHTML = `
              <div style="color: #666666;">
                Ready to make a difference? Apply now to join this volunteer opportunity.
              </div>
            `;
          }
        }
      }
    })
    .catch((error) => {
      console.error('Error checking application status:', error);
    });
}

// Apply to event
function applyToEvent() {
  const user = auth.currentUser;
  if (!user) {
    showErrorToast('Please log in to apply for events.');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  if (!eventId) {
    showErrorToast('Event ID not found');
    return;
  }

  console.log('Applying to event:', eventId);

  // Show loading toast
  const loadingToast = showInfoToast('Submitting your application...', 'Applying');

  // First, get the event details
  db.collection('events').doc(eventId).get()
    .then((eventDoc) => {
      if (eventDoc.exists) {
        const event = eventDoc.data();
        console.log('Event found:', event.title);
        
        // Check if user has already applied
        return db.collection('users').doc(user.uid).get()
          .then((userDoc) => {
            const userData = userDoc.data();
            const existingApplications = userData.applications || [];
            const hasApplied = existingApplications.some(app => app.eventId === eventId);
            
            if (hasApplied) {
              dismissToast(loadingToast);
              showWarningToast('You have already applied to this event!', 'Already Applied');
              return null;
            }

            // If event has Google Form, show it to the user
            if (event.googleFormUrl) {
              const shouldOpenForm = confirm(
                `This event requires additional information. Would you like to fill out the Google Form now?\n\nEvent: ${event.title}`
              );
              
              if (shouldOpenForm) {
                window.open(event.googleFormUrl, '_blank');
              }
            }

            // Create application record
            const applicationData = {
              eventId: eventId,
              eventTitle: event.title,
              volunteerId: user.uid,
              volunteerName: user.displayName || user.email,
              volunteerEmail: user.email,
              ngoId: event.ngoId,
              appliedAt: new Date().toISOString(),
              status: 'pending'
            };

            // Store application in user's own document
            return db.collection('users').doc(user.uid).update({
              applications: firebase.firestore.FieldValue.arrayUnion(applicationData)
            }).then(() => {
              // Create notification for NGO
              return createNGONotification(eventId, user.uid, event, userData);
            });
          });
      } else {
        throw new Error('Event not found');
      }
    })
    .then((result) => {
      if (result) {
        console.log('Application created successfully');
        dismissToast(loadingToast);
        showSuccessToast('Application submitted successfully!', 'Application Submitted');
        checkApplicationStatus(eventId);
      }
    })
    .catch((error) => {
      console.error('Error applying to event:', error);
      dismissToast(loadingToast);
      showErrorToast('Error applying to event. Please try again.', 'Application Failed');
    });
}

// Create notification for NGO when someone applies
function createNGONotification(eventId, volunteerId, event, userData) {
  const ngoId = event.ngoId;
  const volunteerName = userData.name || userData.email || 'Unknown Volunteer';
  
  // Validate required fields
  if (!ngoId || !eventId || !volunteerId) {
    console.error('Missing required fields for notification:', { ngoId, eventId, volunteerId });
    return Promise.resolve(); // Return resolved promise to continue the flow
  }
  
  // Create notification for NGO
  const notification = {
    type: 'new_application',
    eventId: eventId,
    eventTitle: event.title || 'Unknown Event',
    volunteerId: volunteerId,
    volunteerName: volunteerName,
    volunteerEmail: userData.email || '',
    ngoId: ngoId,
    message: `New application for "${event.title || 'Unknown Event'}"`,
    createdAt: new Date().toISOString(),
    read: false
  };

  // Store notification in a separate notifications collection
  // This allows volunteers to create notifications without needing write access to NGO documents
  return db.collection('notifications').add(notification)
    .then((docRef) => {
      console.log('Notification created successfully:', docRef.id);
      return Promise.resolve();
    })
    .catch((error) => {
      console.error('Error creating NGO notification:', error);
      
      // If it's a permissions error, log it but don't break the application
      if (error.code === 'permission-denied') {
        console.warn('Notification creation failed due to permissions. Please update Firebase security rules.');
        console.warn('Copy the rules from firestore-security-rules.txt to your Firebase Console > Firestore Database > Rules');
      }
      
      // Return resolved promise to prevent breaking the application flow
      return Promise.resolve();
    });
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `simple-notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  // Set background color based on type
  const colors = {
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
    warning: '#FF9800'
  };
  notification.style.backgroundColor = colors[type] || colors.info;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Display organizer information from event document
function displayOrganizerInfo(event) {
  const organizerInfo = document.getElementById('organizerInfo');
  if (!organizerInfo) {
    console.warn('Organizer info element not found');
    return;
  }

  // Update the "Organized by" name in the correct element
  const organizerNameP = document.getElementById('eventOrganizer');
  if (organizerNameP) {
    organizerNameP.textContent = 'Organized by: ' + (event.organizerName || 'Unknown Organization');
  }
  
  organizerInfo.innerHTML = `
    <div class="organizer-details">
      <h4>${event.organizerName || 'Unknown Organization'}</h4>
      ${event.organizerMission ? `<p><strong>Mission:</strong> ${event.organizerMission}</p>` : ''}
      ${event.organizerLocation ? `<p><strong>Location:</strong> ${event.organizerLocation}</p>` : ''}
      ${event.organizerPhone ? `<p><strong>Contact:</strong> ${event.organizerPhone}</p>` : ''}
      ${event.organizerEmail ? `<p><strong>Email:</strong> ${event.organizerEmail}</p>` : ''}
    </div>
  `;
} 