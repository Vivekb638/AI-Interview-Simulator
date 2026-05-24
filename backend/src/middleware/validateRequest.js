const responseFormatter = require('../utils/responseFormatter');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true, // Allow unknown keys by default, or configure schema
      stripUnknown: true  // Remove unknown keys
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return responseFormatter.error(res, `Validation Error: ${errorMessage}`, 400);
    }

    // Replace req.body with validated value (useful if stripUnknown is true)
    req.body = value;
    next();
  };
};

module.exports = validateRequest;
