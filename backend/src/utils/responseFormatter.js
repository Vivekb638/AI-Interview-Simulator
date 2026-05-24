const responseFormatter = {
  /**
   * Format a success response
   * @param {Object} res - Express response object
   * @param {Object|Array} data - The payload to send
   * @param {String} message - Success message
   * @param {Number} statusCode - HTTP status code (default 200)
   */
  success: (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  /**
   * Format an error response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Number} statusCode - HTTP status code (default 500)
   * @param {Object|Array|String} errors - Detailed errors if any
   */
  error: (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    const payload = {
      success: false,
      message
    };
    if (errors) {
      payload.errors = errors;
    }
    return res.status(statusCode).json(payload);
  }
};

module.exports = responseFormatter;
