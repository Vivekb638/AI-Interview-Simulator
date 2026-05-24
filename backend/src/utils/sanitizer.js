// Basic sanitizer for inputs
const sanitizer = {
  /**
   * Simple HTML escaper to prevent basic XSS
   */
  escapeHTML: (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Recursively sanitize object values
   */
  sanitizeObject: (obj) => {
    if (obj === null || typeof obj !== 'object') {
      return sanitizer.escapeHTML(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizer.sanitizeObject(item));
    }

    const sanitizedObj = {};
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        sanitizedObj[key] = sanitizer.sanitizeObject(obj[key]);
      }
    }
    return sanitizedObj;
  }
};

module.exports = sanitizer;
