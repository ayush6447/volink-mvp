// Performance monitoring for Volink
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoads: {},
      userInteractions: {},
      errors: []
    };
    this.init();
  }

  init() {
    this.monitorPageLoad();
    this.monitorUserInteractions();
    this.monitorErrors();
  }

  monitorPageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      const metrics = {
        page: window.location.pathname,
        timestamp: Date.now(),
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };

      this.metrics.pageLoads[window.location.pathname] = metrics;
      console.log('Page load metrics:', metrics);
    });
  }

  monitorUserInteractions() {
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        const interaction = {
          type: 'click',
          element: e.target.tagName,
          text: e.target.textContent?.trim(),
          page: window.location.pathname,
          timestamp: Date.now()
        };
        
        this.metrics.userInteractions[Date.now()] = interaction;
        console.log('User interaction:', interaction);
      }
    });
  }

  monitorErrors() {
    window.addEventListener('error', (e) => {
      const error = {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        page: window.location.pathname,
        timestamp: Date.now()
      };
      
      this.metrics.errors.push(error);
      console.error('Performance monitor caught error:', error);
    });
  }

  getMetrics() {
    return this.metrics;
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();
window.performanceMonitor = performanceMonitor; 