const Joi = require('joi');

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  SUPABASE_URL: Joi.string().uri().required(),
  VITE_SUPABASE_ANON_KEY: Joi.string().required(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().optional(),
  PYTHON_SERVICE_URL: Joi.string().uri().optional(),
  JUDGE0_API_URL: Joi.string().uri().optional(),
  JWT_SECRET: Joi.string().required()
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  console.error(`⚠️ Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT,
  supabaseUrl: envVars.SUPABASE_URL,
  supabaseKey: envVars.VITE_SUPABASE_ANON_KEY,
  jwtSecret: envVars.JWT_SECRET,
  judge0Url: envVars.JUDGE0_API_URL
};
