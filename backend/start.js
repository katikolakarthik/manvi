#!/usr/bin/env node

require('dotenv').config();
const app = require('./server');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  logger.info(`📚 API Documentation: Check README.md for endpoints`);
  logger.info(`🔐 JWT Secret loaded: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
}); 