const port = String(process.env.PORT);
const dbUri = String(process.env.DB_URI);
const corsOrigin = String(process.env.CORS_ORIGIN);
const refreshSecret = String(process.env.REFRESH_SECRET);
const refreshExpiry = String(process.env.REFRESH_EXPIRY);
const accessExpiry = String(process.env.ACCESS_EXPIRY);
const accessSecret = String(process.env.ACCESS_SECRET);
const cloudName = String(process.env.CLOUD_NAME);
const apiKey = String(process.env.API_KEY);
const apiSecret = String(process.env.API_SECRET);
export default {
  port,
  dbUri,
  corsOrigin,
  refreshSecret,
  refreshExpiry,
  accessExpiry,
  accessSecret,
  cloudName,
  apiKey,
  apiSecret,
};
