const Joi = require('joi');

const validatePayload = (schema, payload) => {
  const { error, value } = schema.validate(payload, { abortEarly: false });
  if (error) {
    const details = error.details.map(d => d.message).join(', ');
    throw new Error(`Socket Payload Validation Error: ${details}`);
  }
  return value;
};

const joinRoomSchema = Joi.object({
  roomId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
  role: Joi.string().valid('Candidate', 'Recruiter', 'Admin').optional()
});

const chatMessageSchema = Joi.object({
  roomId: Joi.string().uuid().required(),
  senderId: Joi.string().uuid().required(),
  content: Joi.string().min(1).max(2000).required(),
  timestamp: Joi.date().iso().required()
});

const cheatingEventSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
  type: Joi.string().valid('TAB_SWITCH', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'SCREENSHOT_ATTEMPT', 'RIGHT_CLICK').required(),
  severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').required(),
  details: Joi.string().optional(),
  timestamp: Joi.date().iso().required()
});

const webrtcSignalSchema = Joi.object({
  roomId: Joi.string().uuid().required(),
  senderId: Joi.string().uuid().required(),
  targetId: Joi.string().uuid().optional(),
  signalData: Joi.object().required()
});

module.exports = {
  validatePayload,
  joinRoomSchema,
  chatMessageSchema,
  cheatingEventSchema,
  webrtcSignalSchema
};
