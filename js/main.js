// Main application logic
document.addEventListener('DOMContentLoaded', function() {
  console.log('Volink main.js loaded');

  // Only handle dashboard functionality, let auth.js handle authentication
  if (window.location.pathname.includes('dashboard.html')) {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log('User logged in:', user.email);
        try {
          loadUserData(user.uid);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    });
  }
});

// Performance optimizations
let debounceTimer;
let throttleTimer;

// Debounce function for search and filtering
function debounce(func, wait) {
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(debounceTimer);
      func(...args);
    };
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(later, wait);
  };
}

// Throttle function for scroll and resize events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Optimized event listener for window resize
const optimizedResize = throttle(() => {
  // Handle responsive layout changes
  console.log('Window resized - optimizing layout');
}, 250);

// Add optimized resize listener
window.addEventListener('resize', optimizedResize);

// Optimized scroll handler for infinite loading
const optimizedScroll = throttle(() => {
  // Check if user is near bottom for potential infinite loading
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
    console.log('Near bottom - could load more content');
  }
}, 100);

// Add optimized scroll listener
window.addEventListener('scroll', optimizedScroll);

// Toast notification functions are now centralized in utils.js
// Legacy notification system for backward compatibility
const notificationQueue = [];
let isShowingNotification = false;

function showOptimizedNotification(message, type = 'info') {
  // Use new toast system instead
  showToast(message, type);
}

function processNotificationQueue() {
  // Legacy function - no longer needed
}

// Replace the old showNotification function
function showNotification(message, type = 'info') {
  showToast(message, type);
}

// Event Categories
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

// Performance optimizations and caching
let userDataCache = null;
let eventsCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Skeleton Loading System
function showSkeletonLoading(container, type = 'events') {
  container.innerHTML = '';
  
  switch(type) {
    case 'events':
      showEventsSkeleton(container);
      break;
    case 'stats':
      showStatsSkeleton(container);
      break;
    case 'profile':
      showProfileSkeleton(container);
      break;
    case 'applications':
      showApplicationsSkeleton(container);
      break;
    case 'history':
      showHistorySkeleton(container);
      break;
    default:
      showGenericSkeleton(container);
  }
}

function showEventsSkeleton(container) {
  const skeletonHTML = `
    <div class="skeleton-grid">
      ${Array(6).fill().map(() => `
        <div class="skeleton-event-card">
          <div class="skeleton-event-header">
            <div class="skeleton-event-category"></div>
            <div class="skeleton-event-date"></div>
          </div>
          <div class="skeleton-event-title"></div>
          <div class="skeleton-event-description"></div>
          <div class="skeleton-event-description short"></div>
          <div class="skeleton-event-details">
            <div class="skeleton-detail-item">
              <div class="skeleton-detail-icon"></div>
              <div class="skeleton-detail-text"></div>
            </div>
            <div class="skeleton-detail-item">
              <div class="skeleton-detail-icon"></div>
              <div class="skeleton-detail-text"></div>
            </div>
          </div>
          <div class="skeleton-event-actions">
            <div class="skeleton-action-btn primary"></div>
            <div class="skeleton-action-btn"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  container.innerHTML = skeletonHTML;
}

function showStatsSkeleton(container) {
  const skeletonHTML = `
    <div class="skeleton-stats-grid">
      ${Array(4).fill().map(() => `
        <div class="skeleton-stat-item">
          <div class="skeleton-stat-number"></div>
          <div class="skeleton-stat-label"></div>
        </div>
      `).join('')}
    </div>
  `;
  container.innerHTML = skeletonHTML;
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

function showApplicationsSkeleton(container) {
  const skeletonHTML = `
    <div class="skeleton-container">
      ${Array(4).fill().map(() => `
        <div class="skeleton-card">
          <div class="skeleton-header">
            <div class="skeleton-avatar"></div>
            <div>
              <div class="skeleton-title"></div>
              <div class="skeleton-subtitle"></div>
            </div>
          </div>
          <div class="skeleton-content">
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line short"></div>
            <div class="skeleton-badge"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  container.innerHTML = skeletonHTML;
}

function showHistorySkeleton(container) {
  const skeletonHTML = `
    <div class="skeleton-container">
      ${Array(5).fill().map(() => `
        <div class="skeleton-card">
          <div class="skeleton-header">
            <div class="skeleton-title"></div>
            <div class="skeleton-badge"></div>
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

// Optimized user data loading with caching
function loadUserData(userId) {
  // Check if userId is valid
  if (!userId) {
    console.error('Invalid userId for loadUserData');
    const fallbackData = { role: 'volunteer', name: 'User', uid: null };
    displayDashboard(fallbackData);
    return Promise.resolve(fallbackData);
  }

  const now = Date.now();
  
  // Return cached data if still valid
  if (userDataCache && (now - lastCacheTime) < CACHE_DURATION) {
    console.log('Using cached user data');
    // Ensure cached data has uid
    if (!userDataCache.uid) {
      userDataCache.uid = userId;
    }
    displayDashboard(userDataCache);
    return Promise.resolve(userDataCache);
  }

  console.log('Loading fresh user data...');
  
  // Show skeleton loading while fetching data
  const dashboardContent = document.getElementById('dashboardContent');
  if (dashboardContent) {
    showSkeletonLoading(dashboardContent, 'stats');
  }
  
  return db.collection('users').doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = { ...doc.data(), uid: userId };
        console.log('User data loaded:', userData);
        
        // Cache the data
        userDataCache = userData;
        lastCacheTime = now;
        
        displayDashboard(userData);
        return userData;
      } else {
        console.log('No user data found');
        const defaultData = { role: 'volunteer', name: 'New User', uid: userId };
        userDataCache = defaultData;
        lastCacheTime = now;
        displayDashboard(defaultData);
        return defaultData;
      }
    })
    .catch((error) => {
      console.error('Error loading user data:', error);
      const fallbackData = { role: 'volunteer', name: 'User', uid: userId };
      displayDashboard(fallbackData);
      return fallbackData;
    });
}

// Display role-based dashboard content
function displayDashboard(userData) {
  const dashboardContent = document.getElementById('dashboardContent');
  if (!dashboardContent) return;

  console.log('Displaying dashboard for user:', userData);
  const { role, name, email, uid } = userData;

  if (role === 'ngo') {
    console.log('Displaying NGO dashboard for user:', uid);
    displayNGODashboard(userData);
  } else {
    console.log('Displaying volunteer dashboard for user:', uid);
    displayVolunteerDashboard(userData);
  }
}

// Display volunteer dashboard
function displayVolunteerDashboard(userData) {
  const dashboardContent = document.getElementById('dashboardContent');
  const avatarUrl = userData.photoURL && userData.photoURL !== '' ? userData.photoURL : 'assets/images/default-avatar.svg';
  dashboardContent.innerHTML = `
    <div class="dashboard-main-grid">
      <!-- Main Center: Available Events and other sections -->
      <div class="dashboard-center">
        <div class="dashboard-welcome">
          <h3>Welcome back, ${userData.name || 'Volunteer'}! 👋</h3>
          <p>Ready to make a difference? Discover meaningful volunteer opportunities and track your impact.</p>
        </div>
        <div class="dashboard-section-card events-card">
          <div class="card-header">
            <h4>🎯 Available Events</h4>
            <button class="refresh-btn" onclick="loadAvailableEvents()" title="Refresh events">🔄</button>
          </div>
          <div class="event-filters-pro">
            <select id="categoryFilter" onchange="filterEvents()">
              <option value="">All Categories</option>
              <option value="education">📚 Education</option>
              <option value="environment">🌱 Environment</option>
              <option value="health">🏥 Healthcare</option>
              <option value="community">🏘️ Community</option>
              <option value="animals">🐾 Animals</option>
              <option value="disaster">🚨 Disaster Relief</option>
              <option value="technology">💻 Technology</option>
              <option value="arts">🎨 Arts & Culture</option>
              <option value="sports">⚽ Sports</option>
              <option value="other">🤝 Other</option>
            </select>
            <select id="locationFilter" onchange="filterEvents()">
              <option value="">All Locations</option>
              <option value="remote">🌐 Remote</option>
              <option value="onsite">📍 On-site</option>
            </select>
            <select id="dateFilter" onchange="filterEvents()">
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div id="availableEvents" class="events-container-pro">
            <div class="loading-skeleton title"></div>
            <div class="loading-skeleton text"></div>
            <div class="loading-skeleton text"></div>
            <div class="loading-skeleton text"></div>
          </div>
          <div class="event-actions">
            <button class="dashboard-btn" onclick="loadAvailableEvents()">🔄 Refresh Events</button>
            <button class="dashboard-btn secondary" onclick="showEventSearch()">🔍 Advanced Search</button>
          </div>
        </div>
        <div class="dashboard-section-row">
          <div class="dashboard-section-card applications-card">
            <div class="card-header">
              <h4>✅ Your Applications</h4>
              <span class="applications-count" id="applicationsCount">0</span>
            </div>
            <div id="appliedEvents" class="applications-container">
              <p>Loading your applications...</p>
            </div>
          </div>
          <div class="dashboard-section-card bookmarks-card">
            <div class="card-header">
              <h4>📌 Bookmarked Events</h4>
              <button class="refresh-btn" onclick="loadBookmarkedEvents()" title="Refresh bookmarks">🔄</button>
            </div>
            <div id="bookmarkedEvents" class="bookmarks-container">
              <p>Loading your bookmarks...</p>
            </div>
          </div>
          <div class="dashboard-section-card history-card">
            <div class="card-header">
              <h4>📊 Volunteering History</h4>
              <span class="history-count" id="historyCount">0</span>
            </div>
            <div id="volunteeringHistory" class="history-container">
              <p>Loading your history...</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Side: Profile Card -->
      <aside class="dashboard-profile-side">
        <div class="dashboard-section-card profile-card-small">
          <div class="profile-avatar-wrap">
            <img src="${avatarUrl}" alt="Profile Photo" class="profile-avatar-img" />
          </div>
          <div class="profile-side-info">
            <h4>${userData.name || 'Volunteer'}</h4>
            <span class="profile-role-badge">Volunteer</span>
            <div class="profile-side-meta">
              <div><span>📍</span> ${userData.location || 'Not specified'}</div>
              <div><span>🛠️</span> ${userData.skills && userData.skills.length > 0 ? userData.skills.join(', ') : 'No skills added'}</div>
            </div>
            <a href="profile.html" class="edit-profile-btn">Edit Profile</a>
          </div>
        </div>
      </aside>
    </div>
  `;

  // Load user's applied events and data
  if (userData && userData.uid) {
    loadAppliedEvents(userData.uid);
    loadVolunteeringHistory(userData.uid);
  } else {
    console.error('No user ID found for volunteer dashboard');
    document.getElementById('appliedEvents').innerHTML = '<p>Error: User ID not found.</p>';
    document.getElementById('volunteeringHistory').innerHTML = '<p>Error: User ID not found.</p>';
  }

  // Load available events
  loadAvailableEvents();
  loadBookmarkedEvents();
}

// Display NGO dashboard
function displayNGODashboard(userData) {
  console.log('Displaying NGO dashboard with userData:', userData);
  
  const dashboardContent = document.getElementById('dashboardContent');
  
  dashboardContent.innerHTML = `
    <div class="dashboard-welcome">
      <h3>Welcome, ${userData.name || 'NGO'}!</h3>
      <p>Manage your events and connect with volunteers.</p>
      ${userData.mission ? `<p><strong>Mission:</strong> ${userData.mission}</p>` : ''}
    </div>
    
    <div class="dashboard-sections">
      <div class="dashboard-section-card">
        <h4>🏢 NGO Profile</h4>
        <div class="profile-summary">
          <p><strong>Mission:</strong> ${userData.mission || 'No mission statement yet'}</p>
          <p><strong>Location:</strong> ${userData.location || 'Not specified'}</p>
          <p><strong>Phone:</strong> ${userData.phone || 'Not specified'}</p>
        </div>
        <div class="quick-actions">
          <a href="profile.html" class="dashboard-btn">Edit Profile</a>
          <button class="dashboard-btn primary" onclick="showEventForm()">Create New Event</button>
        </div>
      </div>
      
      <div class="dashboard-section-card">
        <h4>📊 Event Statistics</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number" id="totalEvents">-</span>
            <span class="stat-label">Total Events</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" id="activeEvents">-</span>
            <span class="stat-label">Active Events</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" id="totalApplicants">-</span>
            <span class="stat-label">Total Applicants</span>
          </div>
        </div>
      </div>
      
      <div class="dashboard-section-card">
        <h4>📋 Your Events</h4>
        <div class="event-actions-header">
          <button class="dashboard-btn secondary" onclick="showEventForm()">Create Event</button>
          <select id="eventStatusFilter" onchange="filterNGOEvents()">
            <option value="">All Events</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div id="ngoEvents">
          <p>Loading your events...</p>
        </div>
      </div>
      
      <div class="dashboard-section-card">
        <h4>👥 Recent Applicants</h4>
        <div id="recentApplicants">
          <p>Loading recent applicants...</p>
        </div>
      </div>
    </div>
  `;

  // Load NGO's events and statistics
  const ngoId = userData?.uid || auth.currentUser?.uid;
  
  if (ngoId) {
    console.log('Loading NGO data with uid:', ngoId);
    loadNGOEvents(ngoId);
    loadNGOStatistics(ngoId);
    loadRecentApplicants(ngoId);
  } else {
    console.error('No user ID found for NGO dashboard');
    document.getElementById('ngoEvents').innerHTML = '<p>Error: User ID not found.</p>';
    document.getElementById('recentApplicants').innerHTML = '<p>Error: User ID not found.</p>';
  }
}

// Load available events for volunteers with pagination and caching
function loadAvailableEvents() {
  const eventsContainer = document.getElementById('availableEvents');
  if (!eventsContainer) return;

  // Check cache first
  const now = Date.now();
  if (eventsCache && (now - lastCacheTime) < CACHE_DURATION) {
    console.log('Using cached events data');
    displayEvents(eventsCache, eventsContainer);
    return;
  }

  // Show skeleton loading
  showSkeletonLoading(eventsContainer, 'events');

  // Limit to 20 events for better performance - remove orderBy to avoid index requirement
  db.collection('events')
    .where('status', '==', 'active')
    .limit(20)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        eventsContainer.innerHTML = '<p>No events available at the moment.</p>';
        return;
      }

      const events = [];
      querySnapshot.forEach((doc) => {
        events.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Cache the events
      eventsCache = events;
      lastCacheTime = now;
      
      displayEvents(events, eventsContainer);
    })
    .catch((error) => {
      console.error('Error loading events:', error);
      eventsContainer.innerHTML = '<p>Error loading events.</p>';
    });
}

// Display events with optimized rendering
function displayEvents(events, container) {
  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="no-events">
        <div class="no-events-icon">🎯</div>
        <h3>No events available</h3>
        <p>Check back later for new volunteer opportunities!</p>
        <button class="dashboard-btn" onclick="loadAvailableEvents()">🔄 Refresh</button>
      </div>
    `;
    return;
  }

  // Get current user to check if they've already applied
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  // Load user's applications to check applied status
  if (userId) {
    db.collection('users').doc(userId).get()
      .then((userDoc) => {
        if (userDoc.exists) {
          const userData = userDoc.data();
          const appliedEvents = userData.applications ? userData.applications.map(app => app.eventId) : [];
          displayEventsWithStatus(events, container, appliedEvents);
        } else {
          displayEventsWithStatus(events, container, []);
        }
      })
      .catch((error) => {
        console.error('Error loading user applications:', error);
        displayEventsWithStatus(events, container, []);
      });
  } else {
    displayEventsWithStatus(events, container, []);
  }
}

function displayEventsWithStatus(events, container, appliedEvents) {
  let eventsHTML = '';

  events.forEach((event) => {
    const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'TBD';
    const category = EVENT_CATEGORIES[event.category] || EVENT_CATEGORIES.other;
    const isRemote = event.location && event.location.toLowerCase().includes('remote');
    const isUrgent = event.urgent || false;
    const hasApplied = appliedEvents.includes(event.id);

    // Calculate days until event
    let daysUntilEvent = '';
    let urgencyClass = '';
    if (event.date) {
      const today = new Date();
      const eventDay = new Date(event.date);
      const diffTime = eventDay - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        daysUntilEvent = 'Past event';
        urgencyClass = 'past';
      } else if (diffDays === 0) {
        daysUntilEvent = 'Today';
        urgencyClass = 'urgent';
      } else if (diffDays === 1) {
        daysUntilEvent = 'Tomorrow';
        urgencyClass = 'urgent';
      } else if (diffDays <= 3) {
        daysUntilEvent = `${diffDays} days away`;
        urgencyClass = 'urgent';
      } else if (diffDays <= 7) {
        daysUntilEvent = `${diffDays} days away`;
        urgencyClass = 'soon';
      } else {
        daysUntilEvent = `${diffDays} days away`;
        urgencyClass = 'upcoming';
      }
    }

    eventsHTML += `
      <div class="event-card-pro event-card ${urgencyClass} ${hasApplied ? 'applied' : ''}">
        <div class="event-pro-header">
          <div class="event-pro-category">
            <span class="event-pro-category-badge" style="background: linear-gradient(90deg, #eaf1fb, #f3f6f8); color: #0a66c2;">
              ${category.icon} ${category.name}
            </span>
          </div>
          <div class="event-pro-date-group">
            <span class="event-pro-date"><span class="event-pro-date-icon">📅</span> ${eventDate}</span>
            ${daysUntilEvent ? `<span class="event-pro-days ${urgencyClass}">${daysUntilEvent}</span>` : ''}
          </div>
          <div class="event-pro-badges">
            ${isUrgent ? '<span class="event-pro-badge urgent">Urgent</span>' : ''}
            ${isRemote ? '<span class="event-pro-badge remote">Remote</span>' : ''}
            ${hasApplied ? '<span class="event-pro-badge applied">Applied</span>' : ''}
          </div>
        </div>
        <div class="event-pro-body">
          <h3 class="event-pro-title">${event.title}</h3>
          <p class="event-pro-desc">${event.description ? event.description.substring(0, 120) + (event.description.length > 120 ? '...' : '') : ''}</p>
          <div class="event-pro-details-grid">
            <div class="event-pro-detail">
              <span class="event-pro-detail-icon">📍</span>
              <span class="event-pro-detail-label">Location</span>
              <span class="event-pro-detail-value">${event.location || 'TBD'}</span>
            </div>
            <div class="event-pro-detail">
              <span class="event-pro-detail-icon">⏱️</span>
              <span class="event-pro-detail-label">Duration</span>
              <span class="event-pro-detail-value">${event.duration || 'TBD'}</span>
            </div>
            <div class="event-pro-detail">
              <span class="event-pro-detail-icon">👥</span>
              <span class="event-pro-detail-label">Volunteers</span>
              <span class="event-pro-detail-value">${event.volunteersNeeded || 1}</span>
            </div>
            ${event.ngoName ? `
            <div class="event-pro-detail">
              <span class="event-pro-detail-icon">🏢</span>
              <span class="event-pro-detail-label">Organization</span>
              <span class="event-pro-detail-value">${event.ngoName}</span>
            </div>
            ` : ''}
          </div>
        </div>
        <div class="event-pro-actions">
          <button onclick="bookmarkEvent('${event.id}')" class="event-pro-btn bookmark-btn" title="Save for later">
            📌 Bookmark
          </button>
          <a href="event-detail.html?id=${event.id}" class="event-pro-btn secondary">View Details</a>
          ${hasApplied ?
            `<button class="event-pro-btn applied" disabled>Applied</button>` :
            `<button class="event-pro-btn primary" onclick="applyToEvent('${event.id}')">Apply Now</button>`
          }
        </div>
      </div>
    `;
  });
  container.innerHTML = eventsHTML;
}

// Load applied events for volunteers
function loadAppliedEvents(userId) {
  const appliedContainer = document.getElementById('appliedEvents');
  if (!appliedContainer) return;

  // Check if userId is valid
  if (!userId) {
    console.error('Invalid userId for loadAppliedEvents');
    appliedContainer.innerHTML = '<p>Error: User ID not found.</p>';
    return;
  }

  // Show skeleton loading
  showSkeletonLoading(appliedContainer, 'applications');

  // Get user's applications from their profile
  db.collection('users').doc(userId).get()
    .then((userDoc) => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        const applications = userData.applications || [];
        
        // Update applications count
        const applicationsCount = document.getElementById('applicationsCount');
        if (applicationsCount) {
          applicationsCount.textContent = applications.length;
        }
        
        if (applications.length === 0) {
          appliedContainer.innerHTML = `
            <div class="no-events">
              <div class="no-events-icon">📝</div>
              <h3>No Applications Yet</h3>
              <p>You haven't applied to any events yet. Start by browsing available events!</p>
            </div>
          `;
          return;
        }

        // Get event details for each application
        const eventPromises = applications.map(app => 
          db.collection('events').doc(app.eventId).get()
        );
        
        Promise.all(eventPromises)
          .then((eventDocs) => {
            const events = eventDocs
              .filter(doc => doc.exists)
              .map(doc => ({ ...doc.data(), id: doc.id }));
            
            let eventsHTML = '';
            events.forEach((event) => {
              const application = applications.find(app => app.eventId === event.id);
              const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'TBD';
              const category = EVENT_CATEGORIES[event.category] || EVENT_CATEGORIES.other;
              const appliedDate = application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Unknown';
              let daysUntilEvent = '';
              let urgencyClass = '';
              if (event.date) {
                const today = new Date();
                const eventDay = new Date(event.date);
                const diffTime = eventDay - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays < 0) {
                  daysUntilEvent = 'Past event';
                  urgencyClass = 'past';
                } else if (diffDays === 0) {
                  daysUntilEvent = 'Today';
                  urgencyClass = 'urgent';
                } else if (diffDays === 1) {
                  daysUntilEvent = 'Tomorrow';
                  urgencyClass = 'urgent';
                } else if (diffDays <= 3) {
                  daysUntilEvent = `${diffDays} days away`;
                  urgencyClass = 'urgent';
                } else if (diffDays <= 7) {
                  daysUntilEvent = `${diffDays} days away`;
                  urgencyClass = 'soon';
                } else {
                  daysUntilEvent = `${diffDays} days away`;
                  urgencyClass = 'upcoming';
                }
              }
              eventsHTML += `
                <div class="event-card-pro event-card applied ${urgencyClass}">
                  <div class="event-pro-header">
                    <div class="event-pro-category">
                      <span class="event-pro-category-badge" style="background: linear-gradient(90deg, #eaf1fb, #f3f6f8); color: #0a66c2;">
                        ${category.icon} ${category.name}
                      </span>
                    </div>
                    <div class="event-pro-date-group">
                      <span class="event-pro-date"><span class="event-pro-date-icon">📅</span> ${eventDate}</span>
                      ${daysUntilEvent ? `<span class="event-pro-days ${urgencyClass}">${daysUntilEvent}</span>` : ''}
                    </div>
                    <div class="event-pro-badges">
                      <span class="event-pro-badge applied">Applied</span>
                    </div>
                  </div>
                  <div class="event-pro-body">
                    <h3 class="event-pro-title">${event.title}</h3>
                    <p class="event-pro-desc">${event.description ? event.description.substring(0, 120) + (event.description.length > 120 ? '...' : '') : ''}</p>
                    <div class="event-pro-details-grid">
                      <div class="event-pro-detail">
                        <span class="event-pro-detail-icon">📍</span>
                        <span class="event-pro-detail-label">Location</span>
                        <span class="event-pro-detail-value">${event.location || 'TBD'}</span>
                      </div>
                      <div class="event-pro-detail">
                        <span class="event-pro-detail-icon">⏱️</span>
                        <span class="event-pro-detail-label">Duration</span>
                        <span class="event-pro-detail-value">${event.duration || 'TBD'}</span>
                      </div>
                      <div class="event-pro-detail">
                        <span class="event-pro-detail-icon">👥</span>
                        <span class="event-pro-detail-label">Volunteers</span>
                        <span class="event-pro-detail-value">${event.volunteersNeeded || 1}</span>
                      </div>
                      <div class="event-pro-detail">
                        <span class="event-pro-detail-icon">📅</span>
                        <span class="event-pro-detail-label">Applied</span>
                        <span class="event-pro-detail-value">${appliedDate}</span>
                      </div>
                      ${event.ngoName ? `
                      <div class="event-pro-detail">
                        <span class="event-pro-detail-icon">🏢</span>
                        <span class="event-pro-detail-label">Organization</span>
                        <span class="event-pro-detail-value">${event.ngoName}</span>
                      </div>
                      ` : ''}
                    </div>
                  </div>
                  <div class="event-pro-actions">
                    <a href="event-detail.html?id=${event.id}" class="event-pro-btn secondary">View Details</a>
                  </div>
                </div>
              `;
            });

            appliedContainer.innerHTML = eventsHTML;
          })
          .catch((error) => {
            console.error('Error loading event details:', error);
            appliedContainer.innerHTML = '<p>Error loading event details.</p>';
          });
      } else {
        appliedContainer.innerHTML = '<p>User data not found.</p>';
      }
    })
    .catch((error) => {
      console.error('Error loading applied events:', error);
      appliedContainer.innerHTML = '<p>Error loading your applications.</p>';
    });
}

// Load volunteering history
function loadVolunteeringHistory(userId) {
  const historyContainer = document.getElementById('volunteeringHistory');
  if (!historyContainer) return;

  // Check if userId is valid
  if (!userId) {
    console.error('Invalid userId for loadVolunteeringHistory');
    historyContainer.innerHTML = '<p>Error: User ID not found.</p>';
    return;
  }

  // Show skeleton loading
  showSkeletonLoading(historyContainer, 'history');

  db.collection('users').doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const applications = userData.applications || [];
        
        // Update history count
        const historyCount = document.getElementById('historyCount');
        if (historyCount) {
          historyCount.textContent = applications.length;
        }
        
        if (applications.length === 0) {
          historyContainer.innerHTML = `
            <div class="no-events">
              <div class="no-events-icon">📊</div>
              <h3>No History Yet</h3>
              <p>Your volunteering history will appear here once you start applying to events.</p>
            </div>
          `;
          return;
        }

        // Sort applications by appliedAt date (newest first)
        const sortedApplications = applications.sort((a, b) => {
          if (a.appliedAt && b.appliedAt) {
            return new Date(b.appliedAt) - new Date(a.appliedAt);
          }
          return 0;
        });

        let historyHTML = '';
        sortedApplications.forEach((application) => {
          const appliedDate = application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Unknown';
          let daysUntilEvent = '';
          let urgencyClass = '';
          if (application.eventDate) {
            const today = new Date();
            const eventDay = new Date(application.eventDate);
            const diffTime = eventDay - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 0) {
              daysUntilEvent = 'Past event';
              urgencyClass = 'past';
            } else if (diffDays === 0) {
              daysUntilEvent = 'Today';
              urgencyClass = 'urgent';
            } else if (diffDays === 1) {
              daysUntilEvent = 'Tomorrow';
              urgencyClass = 'urgent';
            } else if (diffDays <= 3) {
              daysUntilEvent = `${diffDays} days away`;
              urgencyClass = 'urgent';
            } else if (diffDays <= 7) {
              daysUntilEvent = `${diffDays} days away`;
              urgencyClass = 'soon';
            } else {
              daysUntilEvent = `${diffDays} days away`;
              urgencyClass = 'upcoming';
            }
          }
          historyHTML += `
            <div class="event-card-pro event-card history-item ${urgencyClass}">
              <div class="event-pro-header">
                <div class="event-pro-category">
                  <span class="event-pro-category-badge" style="background: linear-gradient(90deg, #eaf1fb, #f3f6f8); color: #0a66c2;">
                    📊 History
                  </span>
                </div>
                <div class="event-pro-date-group">
                  <span class="event-pro-date"><span class="event-pro-date-icon">📅</span> ${appliedDate}</span>
                  ${daysUntilEvent ? `<span class="event-pro-days ${urgencyClass}">${daysUntilEvent}</span>` : ''}
                </div>
                <div class="event-pro-badges">
                  <span class="event-pro-badge">${application.status === 'completed' ? 'Completed' : application.status === 'upcoming' ? 'Upcoming' : 'Pending'}</span>
                </div>
              </div>
              <div class="event-pro-body">
                <h3 class="event-pro-title">${application.eventTitle}</h3>
                <div class="event-pro-details-grid">
                  <div class="event-pro-detail">
                    <span class="event-pro-detail-icon">📅</span>
                    <span class="event-pro-detail-label">Applied</span>
                    <span class="event-pro-detail-value">${appliedDate}</span>
                  </div>
                  <div class="event-pro-detail">
                    <span class="event-pro-detail-icon">📋</span>
                    <span class="event-pro-detail-label">Status</span>
                    <span class="event-pro-detail-value">${application.status || 'pending'}</span>
                  </div>
                </div>
              </div>
              <div class="event-pro-actions">
                <a href="event-detail.html?id=${application.eventId}" class="event-pro-btn secondary">View Event</a>
              </div>
            </div>
          `;
        });

        historyContainer.innerHTML = historyHTML;
      } else {
        historyContainer.innerHTML = '<p>No volunteering history found.</p>';
      }
    })
    .catch((error) => {
      console.error('Error loading volunteering history:', error);
      historyContainer.innerHTML = '<p>Error loading your history.</p>';
    });
}

// Load NGO events
function loadNGOEvents(ngoId, statusFilter = null) {
  const eventsContainer = document.getElementById('ngoEvents');
  if (!eventsContainer) return;

  // Check if ngoId is valid
  if (!ngoId) {
    console.error('Invalid ngoId for loadNGOEvents');
    eventsContainer.innerHTML = '<p>Error: NGO ID not found.</p>';
    return;
  }

  // Show skeleton loading
  showSkeletonLoading(eventsContainer, 'events');

  console.log('Loading NGO events for ngoId:', ngoId);

  let query = db.collection('events').where('ngoId', '==', ngoId);
  
  // Apply status filter if provided
  if (statusFilter && statusFilter !== '') {
    query = query.where('status', '==', statusFilter);
  }
  
  // Remove orderBy to avoid index requirement for now
  query.get()
    .then((querySnapshot) => {
      console.log('NGO events query result:', querySnapshot.size, 'events found');
      if (querySnapshot.empty) {
        console.log('No events found for this NGO');
        eventsContainer.innerHTML = '<p>You haven\'t created any events yet.</p>';
        return;
      }

      let eventsHTML = '';
      querySnapshot.forEach((doc) => {
        const event = doc.data();
        const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'TBD';
        const applicantCount = event.applicants ? event.applicants.length : 0;
        
        eventsHTML += `
          <div class="event-card">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <div class="event-details">
              <span><strong>Date:</strong> ${eventDate}</span>
              <span><strong>Location:</strong> ${event.location || 'Not specified'}</span>
              <span><strong>Applicants:</strong> ${applicantCount}</span>
            </div>
            <div class="event-actions">
              <button class="event-btn secondary" onclick="viewApplicants('${doc.id}')">
                View Applicants
              </button>
              <button class="event-btn secondary" onclick="editEvent('${doc.id}')">
                Edit
              </button>
              <button class="event-btn error" onclick="deleteEvent('${doc.id}')">
                Delete
              </button>
            </div>
          </div>
        `;
      });

      eventsContainer.innerHTML = eventsHTML;
    })
    .catch((error) => {
      console.error('Error loading NGO events:', error);
      eventsContainer.innerHTML = '<p>Error loading your events.</p>';
    });
}

// Apply to an event
function applyToEvent(eventId) {
  const user = auth.currentUser;
  if (!user) {
    showErrorToast('Please log in to apply for events.');
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
        
        // Check if user has already applied by checking their own applications
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

            // Create application record in user's own document instead
            const applicationData = {
              eventId: eventId,
              eventTitle: event.title,
              volunteerId: user.uid,
              volunteerName: user.displayName || user.email,
              volunteerEmail: user.email,
              ngoId: event.ngoId,
              appliedAt: new Date().toISOString(), // Use regular timestamp instead of serverTimestamp
              status: 'pending'
            };

            // Store application in user's own document (which they have write access to)
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
        loadAppliedEvents(user.uid);
        loadAvailableEvents(); // Refresh available events
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
  const volunteerName = userData.name || userData.email.split('@')[0];
  
  // Create notification for NGO
  const notification = {
    type: 'new_application',
    eventId: eventId,
    eventTitle: event.title,
    volunteerId: volunteerId,
    volunteerName: volunteerName,
    volunteerEmail: userData.email,
    message: `New application for "${event.title}"`,
    createdAt: new Date().toISOString(),
    read: false
  };
  
  // Add notification to NGO's notifications
  return db.collection('users').doc(ngoId).get()
    .then((ngoDoc) => {
      if (ngoDoc.exists) {
        const ngoData = ngoDoc.data();
        const notifications = ngoData.notifications || [];
        notifications.push(notification);
        
        return db.collection('users').doc(ngoId).update({
          notifications: notifications,
          unreadNotifications: (ngoData.unreadNotifications || 0) + 1
        });
      }
    })
    .catch((error) => {
      console.error('Error creating NGO notification:', error);
    });
}

// Show event creation form for NGOs
function showEventForm(eventId = null) {
  console.log('showEventForm called with eventId:', eventId);
  const isEditing = eventId !== null;
  
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  
  const formHTML = `
    <div class="event-form-overlay">
      <div class="event-form">
        <div class="form-header">
          <h3>${isEditing ? 'Edit Event' : 'Create New Event'}</h3>
          <button type="button" class="close-btn" onclick="hideEventForm()">×</button>
        </div>
        
        <form id="createEventForm" novalidate>
          <div class="form-section">
            <h4>📋 Basic Information</h4>
            
            <div class="form-group">
              <label>Event Title *</label>
              <input type="text" id="eventTitle" required maxlength="100" 
                     placeholder="Enter a compelling event title">
              <div class="form-error" id="titleError"></div>
            </div>
            
            <div class="form-group">
              <label>Category *</label>
              <select id="eventCategory" required>
                <option value="">Select Category</option>
                ${Object.entries(EVENT_CATEGORIES).map(([key, cat]) => 
                  `<option value="${key}">${cat.icon} ${cat.name}</option>`
                ).join('')}
              </select>
              <div class="form-error" id="categoryError"></div>
            </div>
            
            <div class="form-group">
              <label>Description *</label>
              <textarea id="eventDescription" rows="4" required maxlength="500"
                        placeholder="Describe the event, what volunteers will do, and what impact they'll make..."></textarea>
              <div class="char-count"><span id="descCount">0</span>/500</div>
              <div class="form-error" id="descriptionError"></div>
            </div>
          </div>
          
          <div class="form-section">
            <h4>📅 Event Details</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label>Date *</label>
                <input type="date" id="eventDate" required min="${today}">
                <div class="form-error" id="dateError"></div>
              </div>
              <div class="form-group">
                <label>Duration</label>
                <input type="text" id="eventDuration" placeholder="e.g., 2 hours, 1 day">
              </div>
            </div>
            
            <div class="form-group">
              <label>Location *</label>
              <input type="text" id="eventLocation" required 
                     placeholder="e.g., Community Center, Online, Park">
              <div class="form-error" id="locationError"></div>
            </div>
          </div>
          
          <div class="form-section">
            <h4>👥 Volunteer Requirements</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label>Skills Required</label>
                <input type="text" id="eventSkills" 
                       placeholder="e.g., Teaching, Communication, Technical">
                <small>Separate skills with commas</small>
              </div>
              <div class="form-group">
                <label>Volunteers Needed</label>
                <input type="number" id="eventVolunteers" value="1" min="1" max="100">
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h4>🔗 Additional Information</h4>
            
            <div class="form-group">
              <label>Google Form URL (Optional)</label>
              <input type="url" id="googleFormUrl" 
                     placeholder="https://forms.google.com/...">
              <small>Add a Google Form for volunteers to fill out when applying</small>
              <div class="form-error" id="urlError"></div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" id="submitBtn">
              <span class="btn-text">${isEditing ? 'Update Event' : 'Create Event'}</span>
              <span class="btn-loading" style="display: none;">Processing...</span>
            </button>
            <button type="button" class="cancel-btn" onclick="hideEventForm()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', formHTML);

  // Initialize form
  initializeEventForm(isEditing, eventId);
}

// Initialize event form with enhanced features
function initializeEventForm(isEditing, eventId) {
  const form = document.getElementById('createEventForm');
  const descTextarea = document.getElementById('eventDescription');
  const descCount = document.getElementById('descCount');
  
  // Character counter for description
  descTextarea.addEventListener('input', function() {
    const count = this.value.length;
    descCount.textContent = count;
    if (count > 450) {
      descCount.style.color = '#f44336';
    } else if (count > 400) {
      descCount.style.color = '#ff9800';
    } else {
      descCount.style.color = '#666';
    }
  });
  
  // Setup real-time validation using the enhanced validation system
  setupRealTimeValidation('createEventForm');
  
  // If editing, load event data
  if (isEditing && eventId) {
    loadEventData(eventId);
  }

  // Handle form submission with enhanced validation
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm('createEventForm')) {
      if (isEditing) {
        updateEvent(eventId);
      } else {
        createEvent();
      }
    }
  });
}

// Validate individual field
function validateField(field) {
  const errorDiv = document.getElementById(field.id + 'Error');
  let isValid = true;
  let errorMessage = '';

  if (field.hasAttribute('required') && !field.value.trim()) {
    isValid = false;
    errorMessage = 'This field is required';
  } else if (field.id === 'eventTitle' && field.value.length < 5) {
    isValid = false;
    errorMessage = 'Title must be at least 5 characters';
  } else if (field.id === 'eventDescription' && field.value.length < 20) {
    isValid = false;
    errorMessage = 'Description must be at least 20 characters';
  } else if (field.id === 'eventDate') {
    const selectedDate = new Date(field.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      isValid = false;
      errorMessage = 'Date cannot be in the past';
    }
  }

  if (!isValid) {
    field.classList.add('error');
    if (errorDiv) errorDiv.textContent = errorMessage;
  } else {
    field.classList.remove('error');
    if (errorDiv) errorDiv.textContent = '';
  }

  return isValid;
}

// Validate Google Form URL
function validateGoogleFormUrl(field) {
  const errorDiv = document.getElementById('urlError');
  if (!field.value) return true; // Optional field

  const urlPattern = /^https:\/\/forms\.google\.com\/.*$/;
  if (!urlPattern.test(field.value)) {
    field.classList.add('error');
    if (errorDiv) errorDiv.textContent = 'Please enter a valid Google Form URL';
    return false;
  } else {
    field.classList.remove('error');
    if (errorDiv) errorDiv.textContent = '';
    return true;
  }
}

// Clear field error on input
function clearFieldError(field) {
  field.classList.remove('error');
  const errorDiv = document.getElementById(field.id + 'Error');
  if (errorDiv) errorDiv.textContent = '';
}

// Validate entire form
function validateEventForm() {
  console.log('validateEventForm called');
  const requiredFields = ['eventTitle', 'eventCategory', 'eventDescription', 'eventDate', 'eventLocation'];
  let isValid = true;

  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    console.log(`Validating field ${fieldId}:`, field ? field.value : 'field not found');
    if (!validateField(field)) {
      console.log(`Field ${fieldId} validation failed`);
      isValid = false;
    }
  });

  const urlField = document.getElementById('googleFormUrl');
  if (urlField && urlField.value && !validateGoogleFormUrl(urlField)) {
    console.log('Google Form URL validation failed');
    isValid = false;
  }

  console.log('Form validation result:', isValid);
  return isValid;
}

// Load event data for editing
function loadEventData(eventId) {
  db.collection('events').doc(eventId).get()
    .then((doc) => {
      if (doc.exists) {
        const event = doc.data();
        document.getElementById('eventTitle').value = event.title || '';
        document.getElementById('eventCategory').value = event.category || '';
        document.getElementById('eventDescription').value = event.description || '';
        document.getElementById('eventDate').value = event.date || '';
        document.getElementById('eventLocation').value = event.location || '';
        document.getElementById('eventDuration').value = event.duration || '';
        document.getElementById('eventSkills').value = event.skills ? event.skills.join(', ') : '';
        document.getElementById('eventVolunteers').value = event.volunteersNeeded || 1;
        document.getElementById('googleFormUrl').value = event.googleFormUrl || '';
      }
    })
    .catch((error) => {
      console.error('Error loading event data:', error);
    });
}

// Hide event form
function hideEventForm() {
  const overlay = document.querySelector('.event-form-overlay');
  if (overlay) overlay.remove();
}

// Create new event
function createEvent() {
  console.log('createEvent function called');
  const user = auth.currentUser;
  if (!user) {
    console.error('No user found for event creation');
    return;
  }

  console.log('Creating event for user:', user.uid);

  // Show loading state
  const submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) {
    console.error('Submit button not found');
    return;
  }
  
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';

  const title = document.getElementById('eventTitle').value.trim();
  const category = document.getElementById('eventCategory').value;
  const description = document.getElementById('eventDescription').value.trim();
  const date = document.getElementById('eventDate').value;
  const location = document.getElementById('eventLocation').value.trim();
  const duration = document.getElementById('eventDuration').value.trim();
  const skills = document.getElementById('eventSkills').value.trim();
  const volunteersNeeded = parseInt(document.getElementById('eventVolunteers').value) || 1;
  const googleFormUrl = document.getElementById('googleFormUrl').value.trim();

  const eventData = {
    title: title,
    category: category,
    description: description,
    date: date,
    location: location,
    duration: duration || null,
    skills: skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [],
    volunteersNeeded: volunteersNeeded,
    googleFormUrl: googleFormUrl || null,
    ngoId: user.uid,
    status: 'active',
    applicants: [],
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  // Show loading toast
  const loadingToast = showInfoToast('Creating your event...', 'Creating Event');

  db.collection('events').add(eventData)
    .then((docRef) => {
      dismissToast(loadingToast);
      showSuccessToast('Event created successfully!', 'Event Created');
      hideEventForm();
      loadNGOEvents(user.uid);
      
      // Log event creation for analytics
      console.log('Event created:', docRef.id);
    })
    .catch((error) => {
      console.error('Error creating event:', error);
      dismissToast(loadingToast);
      showErrorToast('Error creating event. Please try again.', 'Creation Failed');
      
      // Reset button state
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    });
}

// Update existing event
function updateEvent(eventId) {
  const user = auth.currentUser;
  if (!user) return;

  // Show loading state
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';

  const title = document.getElementById('eventTitle').value.trim();
  const category = document.getElementById('eventCategory').value;
  const description = document.getElementById('eventDescription').value.trim();
  const date = document.getElementById('eventDate').value;
  const location = document.getElementById('eventLocation').value.trim();
  const duration = document.getElementById('eventDuration').value.trim();
  const skills = document.getElementById('eventSkills').value.trim();
  const volunteersNeeded = parseInt(document.getElementById('eventVolunteers').value) || 1;
  const googleFormUrl = document.getElementById('googleFormUrl').value.trim();

  const updateData = {
    title: title,
    category: category,
    description: description,
    date: date,
    location: location,
    duration: duration || null,
    skills: skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [],
    volunteersNeeded: volunteersNeeded,
    googleFormUrl: googleFormUrl || null,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  // Show loading toast
  const loadingToast = showInfoToast('Updating your event...', 'Updating Event');

  db.collection('events').doc(eventId).update(updateData)
    .then(() => {
      dismissToast(loadingToast);
      showSuccessToast('Event updated successfully!', 'Event Updated');
      hideEventForm();
      loadNGOEvents(user.uid);
      
      // Log event update for analytics
      console.log('Event updated:', eventId);
    })
    .catch((error) => {
      console.error('Error updating event:', error);
      dismissToast(loadingToast);
      showErrorToast('Error updating event. Please try again.', 'Update Failed');
      
      // Reset button state
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    });
}

// Edit event
function editEvent(eventId) {
  showEventForm(eventId);
}

// Delete event
function deleteEvent(eventId) {
  if (confirm('Are you sure you want to delete this event?')) {
    const user = auth.currentUser;
    if (!user) return;

    // Show loading toast
    const loadingToast = showInfoToast('Deleting your event...', 'Deleting Event');

    db.collection('events').doc(eventId).delete()
      .then(() => {
        dismissToast(loadingToast);
        showSuccessToast('Event deleted successfully!', 'Event Deleted');
        loadNGOEvents(user.uid);
      })
      .catch((error) => {
        console.error('Error deleting event:', error);
        dismissToast(loadingToast);
        showErrorToast('Error deleting event. Please try again.', 'Deletion Failed');
      });
  }
}

// View applicants for an event
function viewApplicants(eventId) {
  db.collection('events').doc(eventId).get()
    .then((doc) => {
      if (doc.exists) {
        const event = doc.data();
        const applicants = event.applicants || [];
        
        if (applicants.length === 0) {
          showNotification('No applicants yet for this event.', 'info');
          return;
        }

        // Get applicant details
        const applicantPromises = applicants.map(uid => 
          db.collection('users').doc(uid).get()
        );

        Promise.all(applicantPromises)
          .then((applicantDocs) => {
            let applicantsHTML = `
              <div class="applicants-header">
                <h3>👥 Applicants for "${event.title}"</h3>
                <p class="applicants-count">${applicantDocs.filter(doc => doc.exists).length} applicant(s)</p>
              </div>
            `;
            
            applicantDocs.forEach((doc, index) => {
              if (doc.exists) {
                const user = doc.data();
                const skills = user.skills && Array.isArray(user.skills) ? user.skills.join(', ') : 'None specified';
                const bio = user.bio || 'No bio provided';
                
                applicantsHTML += `
                  <div class="applicant-card">
                    <div class="applicant-header">
                      <div class="applicant-avatar">
                        <span>${user.name ? user.name.charAt(0).toUpperCase() : 'V'}</span>
                      </div>
                      <div class="applicant-info">
                        <h4>${user.name || 'Unknown Volunteer'}</h4>
                        <p class="applicant-email">${user.email || 'No email provided'}</p>
                      </div>
                    </div>
                    
                    <div class="applicant-details">
                      <div class="detail-item">
                        <span class="detail-label">📞 Phone:</span>
                        <span class="detail-value">${user.phone || 'Not provided'}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">🛠️ Skills:</span>
                        <span class="detail-value">${skills}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">📝 Bio:</span>
                        <span class="detail-value">${bio}</span>
                      </div>
                    </div>
                    
                    <div class="applicant-actions">
                      ${user.email ? `<a href="mailto:${user.email}" class="contact-btn email">📧 Email</a>` : ''}
                      ${user.phone ? `<a href="tel:${user.phone}" class="contact-btn call">📞 Call</a>` : ''}
                      <button class="contact-btn message" onclick="sendMessage('${user.uid}', '${user.name}')">💬 Message</button>
                    </div>
                  </div>
                `;
              }
            });

            // Show applicants in a modal
            const modalHTML = `
              <div class="applicants-modal-overlay">
                <div class="applicants-modal">
                  ${applicantsHTML}
                  <div class="modal-actions">
                    <button class="cancel-btn" onclick="closeApplicantsModal()">Close</button>
                  </div>
                </div>
              </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
          })
          .catch((error) => {
            console.error('Error loading applicants:', error);
            showNotification('Error loading applicants.', 'error');
          });
      }
    })
    .catch((error) => {
      console.error('Error loading event:', error);
      showNotification('Error loading event details.', 'error');
    });
}

// Send message to volunteer
function sendMessage(volunteerId, volunteerName) {
  const message = prompt(`Send a message to ${volunteerName}:`);
  if (message && message.trim()) {
    // For now, we'll just show a notification
    // In a full implementation, this would save to Firestore and send notifications
    showNotification(`Message sent to ${volunteerName}!`, 'success');
  }
}

// Filter events for volunteers
function filterEvents() {
  const categoryFilter = document.getElementById('categoryFilter').value;
  const locationFilter = document.getElementById('locationFilter').value;
  
  // Reload events with filters
  loadAvailableEvents();
}

// Filter NGO events
function filterNGOEvents() {
  const statusFilter = document.getElementById('eventStatusFilter').value;
  const user = auth.currentUser;
  if (user) {
    loadNGOEvents(user.uid, statusFilter);
  }
}

// Load NGO statistics
function loadNGOStatistics(ngoId) {
  if (!ngoId) {
    console.error('Invalid ngoId for loadNGOStatistics');
    return;
  }

  const totalEventsEl = document.getElementById('totalEvents');
  const activeEventsEl = document.getElementById('activeEvents');
  const totalApplicantsEl = document.getElementById('totalApplicants');

  // Initialize with loading state
  if (totalEventsEl) totalEventsEl.textContent = '...';
  if (activeEventsEl) activeEventsEl.textContent = '...';
  if (totalApplicantsEl) totalApplicantsEl.textContent = '...';

  Promise.all([
    db.collection('events').where('ngoId', '==', ngoId).get(),
    db.collection('events').where('ngoId', '==', ngoId).where('status', '==', 'active').get(),
    db.collection('users').get() // Get all users to aggregate applications
  ])
  .then(([totalEvents, activeEvents, usersSnapshot]) => {
    // Aggregate total applicants for this NGO
    let totalApplicants = 0;
    usersSnapshot.forEach(doc => {
      const user = doc.data();
      if (user.applications && Array.isArray(user.applications)) {
        totalApplicants += user.applications.filter(app => app.ngoId === ngoId).length;
      }
    });

    // Also count applicants from events
    totalEvents.forEach(doc => {
      const event = doc.data();
      if (event.applicants && Array.isArray(event.applicants)) {
        totalApplicants += event.applicants.length;
      }
    });

    if (totalEventsEl) totalEventsEl.textContent = totalEvents.size;
    if (activeEventsEl) activeEventsEl.textContent = activeEvents.size;
    if (totalApplicantsEl) totalApplicantsEl.textContent = totalApplicants;
  })
  .catch((error) => {
    console.error('Error loading NGO statistics:', error);
    
    if (totalEventsEl) totalEventsEl.textContent = '0';
    if (activeEventsEl) activeEventsEl.textContent = '0';
    if (totalApplicantsEl) totalApplicantsEl.textContent = '0';
  });
}

// Load recent applicants for NGO
function loadRecentApplicants(ngoId) {
  if (!ngoId) {
    console.error('Invalid ngoId for loadRecentApplicants');
    return;
  }

  const applicantsContainer = document.getElementById('recentApplicants');
  if (!applicantsContainer) {
    console.error('Recent applicants container not found');
    return;
  }

  // Try to get from events with applicants first (this should work with current permissions)
  db.collection('events').where('ngoId', '==', ngoId).get()
    .then((eventsSnapshot) => {
      if (eventsSnapshot && !eventsSnapshot.empty) {
        let applicantsHTML = '';
        let applicantCount = 0;
        
        eventsSnapshot.forEach((doc) => {
          const event = doc.data();
          if (event.applicants && Array.isArray(event.applicants) && event.applicants.length > 0) {
            event.applicants.forEach((applicantId, index) => {
              if (applicantCount < 5) {
                applicantsHTML += `
                  <div class="applicant-item">
                    <div class="applicant-info">
                      <div class="applicant-avatar-small">
                        <span>V</span>
                      </div>
                      <div class="applicant-details-small">
                        <strong>Volunteer ${index + 1}</strong>
                        <span class="event-title">${event.title || 'Unknown Event'}</span>
                      </div>
                    </div>
                    <div class="applicant-actions">
                      <button class="small-btn primary" onclick="viewApplicant('${doc.id}-${applicantId}')">View</button>
                      <button class="small-btn secondary" onclick="sendMessage('${applicantId}', 'Volunteer ${index + 1}')">Contact</button>
                    </div>
                  </div>
                `;
                applicantCount++;
              }
            });
          }
        });

        if (applicantCount > 0) {
          applicantsContainer.innerHTML = applicantsHTML;
        } else {
          applicantsContainer.innerHTML = '<p style="color: #666666; text-align: center; padding: 1rem;">No recent applicants</p>';
        }
      } else {
        applicantsContainer.innerHTML = '<p style="color: #666666; text-align: center; padding: 1rem;">No recent applicants</p>';
      }
    })
    .catch((error) => {
      console.error('Error loading recent applicants:', error);
      applicantsContainer.innerHTML = '<p style="color: #666666; text-align: center; padding: 1rem;">No recent applicants</p>';
    });
}

// Advanced Event Search System
let searchResults = [];
let currentSearchFilters = {};

// Enhanced search modal with advanced filters
function showEventSearch() {
  const searchModal = `
    <div class="advanced-search-overlay">
      <div class="advanced-search-modal">
        <div class="search-header">
          <h3>🔍 Advanced Event Search</h3>
          <button type="button" class="close-btn" onclick="closeAdvancedSearch()">×</button>
        </div>
        
        <div class="search-filters-container">
          <!-- Keyword Search -->
          <div class="search-section">
            <h4>📝 Keyword Search</h4>
            <input type="text" id="searchKeyword" placeholder="Search by title, description, skills, or organization...">
          </div>
          
          <!-- Category Filter -->
          <div class="search-section">
            <h4>🏷️ Category</h4>
            <select id="searchCategory">
              <option value="">All Categories</option>
              ${Object.entries(EVENT_CATEGORIES).map(([key, cat]) => 
                `<option value="${key}">${cat.icon} ${cat.name}</option>`
              ).join('')}
            </select>
          </div>
          
          <!-- Location Filter -->
          <div class="search-section">
            <h4>📍 Location</h4>
            <select id="searchLocation">
              <option value="">All Locations</option>
              <option value="remote">🌐 Remote/Online</option>
              <option value="onsite">📍 On-site</option>
            </select>
          </div>
          
          <!-- Date Range -->
          <div class="search-section">
            <h4>📅 Date Range</h4>
            <div class="date-range">
              <input type="date" id="searchDateFrom" placeholder="From">
              <span>to</span>
              <input type="date" id="searchDateTo" placeholder="To">
            </div>
          </div>
          
          <!-- Skills Filter -->
          <div class="search-section">
            <h4>🎯 Skills Required</h4>
            <input type="text" id="searchSkills" placeholder="e.g., Teaching, Communication, Technical">
          </div>
          
          <!-- Volunteers Needed -->
          <div class="search-section">
            <h4>👥 Volunteers Needed</h4>
            <select id="searchVolunteers">
              <option value="">Any number</option>
              <option value="1-5">1-5 volunteers</option>
              <option value="6-10">6-10 volunteers</option>
              <option value="11+">11+ volunteers</option>
            </select>
          </div>
          
          <!-- Urgency Filter -->
          <div class="search-section">
            <h4>🚨 Urgency</h4>
            <div class="urgency-filters">
              <label class="checkbox-label">
                <input type="checkbox" id="searchUrgent">
                <span>Urgent events only</span>
              </label>
            </div>
          </div>
          
          <!-- Sort Options -->
          <div class="search-section">
            <h4>📊 Sort By</h4>
            <select id="searchSort">
              <option value="date">Date (Earliest first)</option>
              <option value="date-desc">Date (Latest first)</option>
              <option value="title">Title (A-Z)</option>
              <option value="volunteers">Volunteers needed</option>
              <option value="urgent">Urgency</option>
            </select>
          </div>
        </div>
        
        <div class="search-actions">
          <button onclick="performAdvancedSearch()" class="search-btn primary">
            🔍 Search Events
          </button>
          <button onclick="clearSearchFilters()" class="search-btn secondary">
            🗑️ Clear Filters
          </button>
        </div>
        
        <div class="search-results-container">
          <div class="results-header">
            <h4 id="resultsCount">Search Results</h4>
            <div class="results-actions">
              <button onclick="exportSearchResults()" class="export-btn" style="display: none;">
                📄 Export Results
              </button>
            </div>
          </div>
          <div id="advancedSearchResults" class="search-results">
            <p class="search-placeholder">Enter search criteria and click "Search Events" to find volunteer opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', searchModal);
  
  // Set default date range (next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  document.getElementById('searchDateFrom').value = today.toISOString().split('T')[0];
  document.getElementById('searchDateTo').value = thirtyDaysFromNow.toISOString().split('T')[0];
}

// Perform advanced search
function performAdvancedSearch() {
  const filters = {
    keyword: document.getElementById('searchKeyword').value.toLowerCase(),
    category: document.getElementById('searchCategory').value,
    location: document.getElementById('searchLocation').value,
    dateFrom: document.getElementById('searchDateFrom').value,
    dateTo: document.getElementById('searchDateTo').value,
    skills: document.getElementById('searchSkills').value.toLowerCase(),
    volunteers: document.getElementById('searchVolunteers').value,
    urgent: document.getElementById('searchUrgent').checked,
    sortBy: document.getElementById('searchSort').value
  };
  
  currentSearchFilters = { ...filters };
  
  // Show loading state
  const resultsContainer = document.getElementById('advancedSearchResults');
  resultsContainer.innerHTML = '<div class="search-loading">🔍 Searching events...</div>';
  
  // Get all active events
  db.collection('events')
    .where('status', '==', 'active')
    .get()
    .then((querySnapshot) => {
      const events = [];
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });
      
      // Apply filters
      const filteredEvents = applySearchFilters(events, filters);
      
      // Sort results
      const sortedEvents = sortSearchResults(filteredEvents, filters.sortBy);
      
      // Store results for export
      searchResults = sortedEvents;
      
      // Display results
      displaySearchResults(sortedEvents);
    })
    .catch((error) => {
      console.error('Error searching events:', error);
      resultsContainer.innerHTML = '<p class="search-error">Error searching events. Please try again.</p>';
    });
}

// Apply search filters
function applySearchFilters(events, filters) {
  return events.filter(event => {
    // Keyword filter
    if (filters.keyword) {
      const searchText = `${event.title} ${event.description} ${event.skills?.join(' ') || ''} ${event.ngoName || ''}`.toLowerCase();
      if (!searchText.includes(filters.keyword)) {
        return false;
      }
    }
    
    // Category filter
    if (filters.category && event.category !== filters.category) {
      return false;
    }
    
    // Location filter
    if (filters.location) {
      const isRemote = event.location?.toLowerCase().includes('remote') || 
                      event.location?.toLowerCase().includes('online');
      if (filters.location === 'remote' && !isRemote) return false;
      if (filters.location === 'onsite' && isRemote) return false;
    }
    
    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      if (!event.date) return false;
      
      const eventDate = new Date(event.date);
      if (filters.dateFrom && eventDate < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && eventDate > new Date(filters.dateTo)) return false;
    }
    
    // Skills filter
    if (filters.skills) {
      const eventSkills = event.skills?.join(' ').toLowerCase() || '';
      if (!eventSkills.includes(filters.skills)) {
        return false;
      }
    }
    
    // Volunteers needed filter
    if (filters.volunteers) {
      const volunteersNeeded = event.volunteersNeeded || 1;
      switch (filters.volunteers) {
        case '1-5':
          if (volunteersNeeded < 1 || volunteersNeeded > 5) return false;
          break;
        case '6-10':
          if (volunteersNeeded < 6 || volunteersNeeded > 10) return false;
          break;
        case '11+':
          if (volunteersNeeded < 11) return false;
          break;
      }
    }
    
    // Urgency filter
    if (filters.urgent && !event.urgent) {
      return false;
    }
    
    return true;
  });
}

// Sort search results
function sortSearchResults(events, sortBy) {
  return events.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date || 0) - new Date(b.date || 0);
      case 'date-desc':
        return new Date(b.date || 0) - new Date(a.date || 0);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'volunteers':
        return (a.volunteersNeeded || 1) - (b.volunteersNeeded || 1);
      case 'urgent':
        return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0);
      default:
        return 0;
    }
  });
}

// Display search results
function displaySearchResults(events) {
  const resultsContainer = document.getElementById('advancedSearchResults');
  const resultsCount = document.getElementById('resultsCount');
  const exportBtn = document.querySelector('.export-btn');
  
  resultsCount.textContent = `Search Results (${events.length} events found)`;
  
  if (events.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No events found</h3>
        <p>Try adjusting your search criteria or browse all available events.</p>
        <button onclick="clearSearchFilters()" class="search-btn secondary">Clear Filters</button>
      </div>
    `;
    exportBtn.style.display = 'none';
    return;
  }
  
  exportBtn.style.display = 'inline-block';
  
  let resultsHTML = '';
  events.forEach((event) => {
    const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'TBD';
    const category = EVENT_CATEGORIES[event.category] || EVENT_CATEGORIES.other;
    const isRemote = event.location?.toLowerCase().includes('remote') || 
                    event.location?.toLowerCase().includes('online');
    
    // Calculate days until event
    let daysUntilEvent = '';
    let urgencyClass = '';
    if (event.date) {
      const today = new Date();
      const eventDay = new Date(event.date);
      const diffTime = eventDay - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        daysUntilEvent = 'Past event';
        urgencyClass = 'past';
      } else if (diffDays === 0) {
        daysUntilEvent = 'Today';
        urgencyClass = 'urgent';
      } else if (diffDays === 1) {
        daysUntilEvent = 'Tomorrow';
        urgencyClass = 'urgent';
      } else if (diffDays <= 3) {
        daysUntilEvent = `${diffDays} days away`;
        urgencyClass = 'urgent';
      } else if (diffDays <= 7) {
        daysUntilEvent = `${diffDays} days away`;
        urgencyClass = 'soon';
      } else {
        daysUntilEvent = `${diffDays} days away`;
        urgencyClass = 'upcoming';
      }
    }
    
    resultsHTML += `
      <div class="search-result-card ${urgencyClass}">
        <div class="result-header">
          <div class="result-category">
            <span class="result-category-badge" style="background: linear-gradient(135deg, ${category.color}20, ${category.color}40); color: ${category.color};">
              ${category.icon} ${category.name}
            </span>
          </div>
          <div class="result-date">
            <span class="result-date-text">📅 ${eventDate}</span>
            ${daysUntilEvent ? `<span class="result-days ${urgencyClass}">${daysUntilEvent}</span>` : ''}
          </div>
          <div class="result-badges">
            ${event.urgent ? '<span class="result-badge urgent">🚨 Urgent</span>' : ''}
            ${isRemote ? '<span class="result-badge remote">🌐 Remote</span>' : ''}
          </div>
        </div>
        
        <div class="result-body">
          <h3 class="result-title">${event.title}</h3>
          <p class="result-description">${event.description ? event.description.substring(0, 150) + (event.description.length > 150 ? '...' : '') : ''}</p>
          
          <div class="result-details">
            <div class="result-detail">
              <span class="result-detail-icon">📍</span>
              <span class="result-detail-label">Location</span>
              <span class="result-detail-value">${event.location || 'TBD'}</span>
            </div>
            <div class="result-detail">
              <span class="result-detail-icon">⏱️</span>
              <span class="result-detail-label">Duration</span>
              <span class="result-detail-value">${event.duration || 'TBD'}</span>
            </div>
            <div class="result-detail">
              <span class="result-detail-icon">👥</span>
              <span class="result-detail-label">Volunteers</span>
              <span class="result-detail-value">${event.volunteersNeeded || 1}</span>
            </div>
            ${event.skills && event.skills.length > 0 ? `
            <div class="result-detail">
              <span class="result-detail-icon">🎯</span>
              <span class="result-detail-label">Skills</span>
              <span class="result-detail-value">${event.skills.join(', ')}</span>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="result-actions">
          <button onclick="bookmarkEvent('${event.id}')" class="result-btn bookmark-btn" title="Save for later">
            📌 Bookmark
          </button>
          <a href="event-detail.html?id=${event.id}" class="result-btn secondary">View Details</a>
          <button onclick="applyToEvent('${event.id}')" class="result-btn primary">Apply Now</button>
        </div>
      </div>
    `;
  });
  
  resultsContainer.innerHTML = resultsHTML;
}

// Clear search filters
function clearSearchFilters() {
  document.getElementById('searchKeyword').value = '';
  document.getElementById('searchCategory').value = '';
  document.getElementById('searchLocation').value = '';
  document.getElementById('searchSkills').value = '';
  document.getElementById('searchVolunteers').value = '';
  document.getElementById('searchUrgent').checked = false;
  document.getElementById('searchSort').value = 'date';
  
  // Reset date range to next 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  document.getElementById('searchDateFrom').value = today.toISOString().split('T')[0];
  document.getElementById('searchDateTo').value = thirtyDaysFromNow.toISOString().split('T')[0];
  
  currentSearchFilters = {};
  document.getElementById('advancedSearchResults').innerHTML = '<p class="search-placeholder">Enter search criteria and click "Search Events" to find volunteer opportunities.</p>';
  document.getElementById('resultsCount').textContent = 'Search Results';
  document.querySelector('.export-btn').style.display = 'none';
}

// Export search results
function exportSearchResults() {
  if (searchResults.length === 0) {
    showWarningToast('No results to export');
    return;
  }
  
  const csvContent = generateCSV(searchResults);
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `volink-events-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  showSuccessToast('Search results exported successfully!', 'Export Complete');
}

// Generate CSV from search results
function generateCSV(events) {
  const headers = ['Title', 'Category', 'Date', 'Location', 'Duration', 'Volunteers Needed', 'Skills', 'Description'];
  const csvRows = [headers.join(',')];
  
  events.forEach(event => {
    const row = [
      `"${event.title}"`,
      `"${EVENT_CATEGORIES[event.category]?.name || 'Other'}"`,
      `"${event.date || 'TBD'}"`,
      `"${event.location || 'TBD'}"`,
      `"${event.duration || 'TBD'}"`,
      event.volunteersNeeded || 1,
      `"${event.skills?.join(', ') || ''}"`,
      `"${event.description?.replace(/"/g, '""') || ''}"`
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
}

// Close advanced search modal
function closeAdvancedSearch() {
  const overlay = document.querySelector('.advanced-search-overlay');
  if (overlay) overlay.remove();
}

// Close search modal
function closeSearchModal() {
  const overlay = document.querySelector('.search-modal-overlay');
  if (overlay) overlay.remove();
}

// View applicant details
function viewApplicant(applicationId) {
  // Handle the case where applicationId might be in format "eventId-applicantId"
  const parts = applicationId.split('-');
  const eventId = parts[0];
  const applicantId = parts[1] || applicationId;
  
  // Try to get applicant details from users collection
  db.collection('users').doc(applicantId).get()
    .then((doc) => {
      if (doc.exists) {
        const user = doc.data();
        const skills = user.skills && Array.isArray(user.skills) ? user.skills.join(', ') : 'None specified';
        const bio = user.bio || 'No bio provided';
        
        const applicantModal = `
          <div class="applicant-modal-overlay">
            <div class="applicant-modal">
              <div class="applicant-header">
                <div class="applicant-avatar">
                  <span>${user.name ? user.name.charAt(0).toUpperCase() : 'V'}</span>
                </div>
                <div class="applicant-info">
                  <h3>${user.name || 'Unknown Volunteer'}</h3>
                  <p class="applicant-email">${user.email || 'No email provided'}</p>
                </div>
              </div>
              
              <div class="applicant-details">
                <div class="detail-item">
                  <span class="detail-label">📞 Phone:</span>
                  <span class="detail-value">${user.phone || 'Not provided'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">🛠️ Skills:</span>
                  <span class="detail-value">${skills}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">📝 Bio:</span>
                  <span class="detail-value">${bio}</span>
                </div>
              </div>
              
              <div class="applicant-actions">
                ${user.email ? `<a href="mailto:${user.email}" class="contact-btn email">📧 Email</a>` : ''}
                ${user.phone ? `<a href="tel:${user.phone}" class="contact-btn call">📞 Call</a>` : ''}
                <button class="contact-btn message" onclick="sendMessage('${user.uid}', '${user.name}')">💬 Message</button>
                <button class="cancel-btn" onclick="closeApplicantModal()">Close</button>
              </div>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', applicantModal);
      } else {
        showNotification('Applicant details not found.', 'error');
      }
    })
    .catch((error) => {
      console.error('Error loading applicant details:', error);
      showNotification('Error loading applicant details.', 'error');
    });
}

// Close applicant modal
function closeApplicantModal() {
  const overlay = document.querySelector('.applicant-modal-overlay');
  if (overlay) overlay.remove();
}

// Close applicants modal
function closeApplicantsModal() {
  const overlay = document.querySelector('.applicants-modal-overlay');
  if (overlay) overlay.remove();
}

// Event Bookmarking System
function bookmarkEvent(eventId) {
  const user = auth.currentUser;
  if (!user) {
    showErrorToast('Please log in to bookmark events.');
    return;
  }

  // Get event details first
  db.collection('events').doc(eventId).get()
    .then((eventDoc) => {
      if (eventDoc.exists) {
        const event = eventDoc.data();
        
        // Check if already bookmarked
        return db.collection('users').doc(user.uid).get()
          .then((userDoc) => {
            const userData = userDoc.data();
            const bookmarks = userData.bookmarks || [];
            const isBookmarked = bookmarks.some(bookmark => bookmark.eventId === eventId);
            
            if (isBookmarked) {
              // Remove bookmark
              const updatedBookmarks = bookmarks.filter(bookmark => bookmark.eventId !== eventId);
              return db.collection('users').doc(user.uid).update({
                bookmarks: updatedBookmarks
              }).then(() => {
                showSuccessToast('Event removed from bookmarks', 'Bookmark Removed');
                updateBookmarkButton(eventId, false);
              });
            } else {
              // Add bookmark
              const bookmarkData = {
                eventId: eventId,
                eventTitle: event.title,
                eventCategory: event.category,
                eventDate: event.date,
                eventLocation: event.location,
                bookmarkedAt: new Date().toISOString()
              };
              
              return db.collection('users').doc(user.uid).update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(bookmarkData)
              }).then(() => {
                showSuccessToast('Event added to bookmarks', 'Bookmark Added');
                updateBookmarkButton(eventId, true);
              });
            }
          });
      } else {
        showErrorToast('Event not found');
      }
    })
    .catch((error) => {
      console.error('Error bookmarking event:', error);
      showErrorToast('Error bookmarking event. Please try again.');
    });
}

// Update bookmark button appearance
function updateBookmarkButton(eventId, isBookmarked) {
  const bookmarkBtn = document.querySelector(`[onclick="bookmarkEvent('${eventId}')"]`);
  if (bookmarkBtn) {
    if (isBookmarked) {
      bookmarkBtn.innerHTML = '📌 Bookmarked';
      bookmarkBtn.classList.add('bookmarked');
      bookmarkBtn.classList.remove('bookmark-btn');
    } else {
      bookmarkBtn.innerHTML = '📌 Bookmark';
      bookmarkBtn.classList.remove('bookmarked');
      bookmarkBtn.classList.add('bookmark-btn');
    }
  }
}

// Load user's bookmarked events
function loadBookmarkedEvents() {
  const user = auth.currentUser;
  if (!user) return;

  const bookmarksContainer = document.getElementById('bookmarkedEvents');
  if (!bookmarksContainer) return;

  // Show skeleton loading
  showSkeletonLoading(bookmarksContainer, 'events');

  db.collection('users').doc(user.uid).get()
    .then((userDoc) => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        const bookmarks = userData.bookmarks || [];
        
        if (bookmarks.length === 0) {
          bookmarksContainer.innerHTML = `
            <div class="no-bookmarks">
              <div class="no-bookmarks-icon">📌</div>
              <h3>No bookmarked events</h3>
              <p>Bookmark events you're interested in to see them here later.</p>
            </div>
          `;
          return;
        }

        // Get event details for each bookmark
        const eventPromises = bookmarks.map(bookmark => 
          db.collection('events').doc(bookmark.eventId).get()
        );

        Promise.all(eventPromises)
          .then((eventDocs) => {
            const events = eventDocs
              .filter(doc => doc.exists)
              .map(doc => ({ ...doc.data(), id: doc.id }));

            displayBookmarkedEvents(events, bookmarks);
          })
          .catch((error) => {
            console.error('Error loading bookmarked events:', error);
            bookmarksContainer.innerHTML = '<p>Error loading bookmarked events.</p>';
          });
      }
    })
    .catch((error) => {
      console.error('Error loading bookmarks:', error);
      bookmarksContainer.innerHTML = '<p>Error loading bookmarks.</p>';
    });
}

// Display bookmarked events
function displayBookmarkedEvents(events, bookmarks) {
  const bookmarksContainer = document.getElementById('bookmarkedEvents');
  
  let eventsHTML = '';
  events.forEach((event) => {
    const bookmark = bookmarks.find(b => b.eventId === event.id);
    const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'TBD';
    const category = EVENT_CATEGORIES[event.category] || EVENT_CATEGORIES.other;
    const bookmarkedDate = bookmark?.bookmarkedAt ? new Date(bookmark.bookmarkedAt).toLocaleDateString() : '';
    
    // Calculate days until event
    let daysUntilEvent = '';
    let urgencyClass = '';
    if (event.date) {
      const today = new Date();
      const eventDay = new Date(event.date);
      const diffTime = eventDay - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        daysUntilEvent = 'Past event';
        urgencyClass = 'past';
      } else if (diffDays === 0) {
        daysUntilEvent = 'Today';
        urgencyClass = 'urgent';
      } else if (diffDays === 1) {
        daysUntilEvent = 'Tomorrow';
        urgencyClass = 'urgent';
      } else if (diffDays <= 3) {
        daysUntilEvent = `${diffDays} days away`;
        urgencyClass = 'urgent';
      } else if (diffDays <= 7) {
        daysUntilEvent = `${diffDays} days away`;
        urgencyClass = 'soon';
      } else {
        daysUntilEvent = `${diffDays} days away`;
        urgencyClass = 'upcoming';
      }
    }

    eventsHTML += `
      <div class="event-card-pro event-card bookmarked ${urgencyClass}">
        <div class="event-pro-header">
          <div class="event-pro-category">
            <span class="event-pro-category-badge" style="background: linear-gradient(90deg, #eaf1fb, #f3f6f8); color: #0a66c2;">
              ${category.icon} ${category.name}
            </span>
          </div>
          <div class="event-pro-date-group">
            <span class="event-pro-date"><span class="event-pro-date-icon">📅</span> ${eventDate}</span>
            ${daysUntilEvent ? `<span class="event-pro-days ${urgencyClass}">${daysUntilEvent}</span>` : ''}
          </div>
          <div class="event-pro-badges">
            <span class="event-pro-badge bookmarked">📌 Bookmarked</span>
            ${event.urgent ? '<span class="event-pro-badge urgent">🚨 Urgent</span>' : ''}
          </div>
        </div>
        
        <div class="event-pro-body">
          <h3 class="event-pro-title">${event.title}</h3>
          <p class="event-pro-desc">${event.description ? event.description.substring(0, 120) + (event.description.length > 120 ? '...' : '') : ''}</p>
          
          <div class="event-pro-details-grid">
            <div class="event-pro-detail">
              <span class="event-pro-detail-icon">📍</span>
              <span class="event-pro-detail-label">Location</span>
              <span class="event-pro-detail-value">${event.location || 'TBD'}</span>
            </div>
            <div class="event-pro-detail">
              <span class="event-pro-detail-icon">⏱️</span>
              <span class="event-pro-detail-label">Duration</span>
              <span class="event-pro-detail-value">${event.duration || 'TBD'}</span>
            </div>
            <div class="event-pro-detail">
              <span class="event-pro-detail-icon">👥</span>
              <span class="event-pro-detail-label">Volunteers</span>
              <span class="event-pro-detail-value">${event.volunteersNeeded || 1}</span>
            </div>
            <div class="event-pro-detail">
              <span class="event-pro-detail-icon">📌</span>
              <span class="event-pro-detail-label">Bookmarked</span>
              <span class="event-pro-detail-value">${bookmarkedDate}</span>
            </div>
          </div>
        </div>
        
        <div class="event-pro-actions">
          <button onclick="removeBookmark('${event.id}')" class="event-pro-btn remove-bookmark">
            🗑️ Remove Bookmark
          </button>
          <a href="event-detail.html?id=${event.id}" class="event-pro-btn secondary">View Details</a>
          <button onclick="applyToEvent('${event.id}')" class="event-pro-btn primary">Apply Now</button>
        </div>
      </div>
    `;
  });
  
  bookmarksContainer.innerHTML = eventsHTML;
}

// Remove bookmark
function removeBookmark(eventId) {
  const user = auth.currentUser;
  if (!user) return;

  db.collection('users').doc(user.uid).get()
    .then((userDoc) => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        const bookmarks = userData.bookmarks || [];
        const updatedBookmarks = bookmarks.filter(bookmark => bookmark.eventId !== eventId);
        
        return db.collection('users').doc(user.uid).update({
          bookmarks: updatedBookmarks
        });
      }
    })
    .then(() => {
      showSuccessToast('Event removed from bookmarks', 'Bookmark Removed');
      loadBookmarkedEvents(); // Refresh the bookmarks list
    })
    .catch((error) => {
      console.error('Error removing bookmark:', error);
      showErrorToast('Error removing bookmark. Please try again.');
    });
}

// Check if event is bookmarked (for display purposes)
function checkBookmarkStatus(eventId) {
  const user = auth.currentUser;
  if (!user) return false;

  return db.collection('users').doc(user.uid).get()
    .then((userDoc) => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        const bookmarks = userData.bookmarks || [];
        return bookmarks.some(bookmark => bookmark.eventId === eventId);
      }
      return false;
    })
    .catch((error) => {
      console.error('Error checking bookmark status:', error);
      return false;
    });
}









 