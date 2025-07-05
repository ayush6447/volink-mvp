document.addEventListener('DOMContentLoaded', function() {
  console.log('Volink utils.js loaded');
}); 

// Utility functions for Volink

// Toast Notification System - Centralized
let toastContainer = null;
let activeToasts = [];

// Initialize toast container
function initToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

// Get toast icon based on type
function getToastIcon(type) {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
      return 'ℹ';
    default:
      return 'ℹ';
  }
}

// Get toast title based on type
function getToastTitle(type) {
  switch (type) {
    case 'success':
      return 'Success';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Warning';
    case 'info':
      return 'Info';
    default:
      return 'Notification';
  }
}

// Show toast notification
function showToast(message, type = 'info', title = null, duration = 5000) {
  initToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = getToastIcon(type);
  const toastTitle = title || getToastTitle(type);
  
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${toastTitle}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="dismissToast(this.parentElement)">×</button>
    <div class="toast-progress"></div>
  `;
  
  toastContainer.appendChild(toast);
  activeToasts.push(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Start progress bar
  const progressBar = toast.querySelector('.toast-progress');
  if (progressBar) {
    progressBar.style.width = '0%';
    setTimeout(() => {
      progressBar.style.width = '100%';
    }, 10);
  }
  
  // Auto dismiss
  const dismissTimeout = setTimeout(() => {
    dismissToast(toast);
  }, duration);
  
  // Store timeout for manual dismissal
  toast.dismissTimeout = dismissTimeout;
  
  return toast;
}

// Dismiss toast
function dismissToast(toast) {
  if (!toast) return;
  
  // Clear auto-dismiss timeout
  if (toast.dismissTimeout) {
    clearTimeout(toast.dismissTimeout);
  }
  
  // Remove from active toasts
  const index = activeToasts.indexOf(toast);
  if (index > -1) {
    activeToasts.splice(index, 1);
  }
  
  // Animate out
  toast.classList.add('hide');
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 300);
}

// Convenience functions for different toast types
function showSuccessToast(message, title = null, duration = 5000) {
  return showToast(message, 'success', title, duration);
}

function showErrorToast(message, title = null, duration = 7000) {
  return showToast(message, 'error', title, duration);
}

function showWarningToast(message, title = null, duration = 6000) {
  return showToast(message, 'warning', title, duration);
}

function showInfoToast(message, title = null, duration = 5000) {
  return showToast(message, 'info', title, duration);
}

// Legacy notification system for backward compatibility
function showNotification(message, type = 'info') {
  showToast(message, type);
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

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

// Date formatting utilities
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatRelativeDate(date) {
  const now = new Date();
  const eventDate = new Date(date);
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Past event';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `${diffDays} days away`;
  return formatDate(date);
}

// Validation utilities
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateRequired(value) {
  return value && value.trim().length > 0;
}

// String utilities
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Enhanced Validation Utilities
const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    minLength: 6,
    message: 'Password must be at least 6 characters long'
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  },
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL starting with http:// or https://'
  },
  googleFormUrl: {
    pattern: /^https:\/\/forms\.google\.com\/.*$/,
    message: 'Please enter a valid Google Form URL'
  }
};

// Enhanced validation functions
function validateField(field, rules = {}) {
  const value = field.value.trim();
  const fieldId = field.id;
  const errorDiv = document.getElementById(fieldId + 'Error');
  
  // Clear previous errors
  clearFieldError(field);
  
  // Required field validation
  if (field.hasAttribute('required') && !value) {
    showFieldError(field, 'This field is required');
    return false;
  }
  
  // Skip further validation if field is empty and not required
  if (!value && !field.hasAttribute('required')) {
    return true;
  }
  
  // Custom validation rules
  if (rules.minLength && value.length < rules.minLength) {
    showFieldError(field, rules.message || `Minimum ${rules.minLength} characters required`);
    return false;
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    showFieldError(field, rules.message || `Maximum ${rules.maxLength} characters allowed`);
    return false;
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    showFieldError(field, rules.message || 'Invalid format');
    return false;
  }
  
  // Field-specific validation
  switch (fieldId) {
    case 'eventTitle':
      if (value.length < 5) {
        showFieldError(field, 'Title must be at least 5 characters');
        return false;
      }
      if (value.length > 100) {
        showFieldError(field, 'Title must be less than 100 characters');
        return false;
      }
      break;
      
    case 'eventDescription':
      if (value.length < 20) {
        showFieldError(field, 'Description must be at least 20 characters');
        return false;
      }
      if (value.length > 500) {
        showFieldError(field, 'Description must be less than 500 characters');
        return false;
      }
      break;
      
    case 'eventDate':
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showFieldError(field, 'Date cannot be in the past');
        return false;
      }
      break;
      
    case 'eventLocation':
      if (value.length < 3) {
        showFieldError(field, 'Location must be at least 3 characters');
        return false;
      }
      break;
      
    case 'registerName':
    case 'profileName':
      if (value.length < 2) {
        showFieldError(field, 'Name must be at least 2 characters');
        return false;
      }
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        showFieldError(field, 'Name can only contain letters and spaces');
        return false;
      }
      break;
      
    case 'registerEmail':
    case 'loginEmail':
      if (!VALIDATION_RULES.email.pattern.test(value)) {
        showFieldError(field, VALIDATION_RULES.email.message);
        return false;
      }
      break;
      
    case 'registerPassword':
    case 'loginPassword':
      if (value.length < VALIDATION_RULES.password.minLength) {
        showFieldError(field, VALIDATION_RULES.password.message);
        return false;
      }
      break;
      
    case 'googleFormUrl':
      if (value && !VALIDATION_RULES.googleFormUrl.pattern.test(value)) {
        showFieldError(field, VALIDATION_RULES.googleFormUrl.message);
        return false;
      }
      break;
      
    case 'profilePhone':
      if (value && !VALIDATION_RULES.phone.pattern.test(value.replace(/\s/g, ''))) {
        showFieldError(field, VALIDATION_RULES.phone.message);
        return false;
      }
      break;
  }
  
  return true;
}

function showFieldError(field, message) {
  field.classList.add('error');
  const errorDiv = document.getElementById(field.id + 'Error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
}

function clearFieldError(field) {
  field.classList.remove('error');
  const errorDiv = document.getElementById(field.id + 'Error');
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
  }
}

function validateForm(formId, customRules = {}) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  let isValid = true;
  const fields = form.querySelectorAll('input, select, textarea');
  
  fields.forEach(field => {
    const fieldRules = customRules[field.id] || {};
    if (!validateField(field, fieldRules)) {
      isValid = false;
    }
  });
  
  return isValid;
}

// Real-time validation setup
function setupRealTimeValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  const fields = form.querySelectorAll('input, select, textarea');
  
  fields.forEach(field => {
    // Clear error on input
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        clearFieldError(field);
      }
    });
    
    // Validate on blur
    field.addEventListener('blur', () => {
      validateField(field);
    });
    
    // Validate on change for select elements
    if (field.tagName === 'SELECT') {
      field.addEventListener('change', () => {
        validateField(field);
      });
    }
  });
} 