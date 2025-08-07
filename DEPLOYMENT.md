# Production Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Manvi application to production.

## Prerequisites
- Node.js 16+ installed
- MongoDB database (local or cloud)
- PM2 for process management (optional but recommended)
- Domain name and SSL certificate
- Razorpay production account

## Backend Deployment

### 1. Environment Setup
```bash
cd backend
cp env.example .env
```

Edit `.env` with production values:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-super-secure-jwt-secret
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_live_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2. Install Dependencies
```bash
npm install --production
```

### 3. Database Setup
```bash
# Create admin user
npm run create-admin

# Add sample products (optional)
npm run add-products
```

### 4. Start Production Server
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start ecosystem.config.js --env production

# Or using Node directly
npm run prod
```

## Frontend Deployment

### 1. Environment Setup
```bash
cd frontend
cp env.production .env.production
```

Edit `.env.production`:
```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_RAZORPAY_KEY_ID=rzp_live_your_key_id
REACT_APP_ENVIRONMENT=production
```

### 2. Build for Production
```bash
npm install
npm run build
```

### 3. Deploy Build
The `build` folder contains the production-ready static files.

## Security Checklist

### Backend Security
- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use production Razorpay keys
- [ ] Remove test endpoints
- [ ] Configure proper logging

### Frontend Security
- [ ] Use HTTPS
- [ ] Configure CSP headers
- [ ] Remove console.log statements
- [ ] Use production API endpoints
- [ ] Validate all inputs

## Performance Optimization

### Backend
- [ ] Enable compression
- [ ] Configure caching
- [ ] Optimize database queries
- [ ] Use PM2 clustering
- [ ] Monitor memory usage

### Frontend
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Use CDN for static assets
- [ ] Implement lazy loading
- [ ] Minimize bundle size

## Monitoring & Logging

### Backend Logs
```bash
# View PM2 logs
pm2 logs manvi-backend

# View specific log files
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

### Health Checks
```bash
# Check server health
curl https://your-backend-domain.com/health
```

## SSL Certificate Setup

### Using Let's Encrypt
```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure Nginx/Apache to use SSL
```

## Database Backup

### MongoDB Backup
```bash
# Create backup
mongodump --uri="mongodb://your-db-url" --out=./backup

# Restore backup
mongorestore --uri="mongodb://your-db-url" ./backup
```

## Troubleshooting

### Common Issues
1. **CORS errors**: Check CORS_ORIGIN configuration
2. **Database connection**: Verify MongoDB URI
3. **Payment failures**: Ensure Razorpay keys are correct
4. **Memory issues**: Monitor PM2 memory usage

### Performance Issues
1. **Slow API responses**: Check database indexes
2. **High memory usage**: Optimize queries and enable caching
3. **Build size too large**: Analyze bundle with webpack-bundle-analyzer

## Maintenance

### Regular Tasks
- [ ] Monitor error logs
- [ ] Backup database weekly
- [ ] Update dependencies monthly
- [ ] Check SSL certificate expiration
- [ ] Monitor disk space

### Updates
```bash
# Update dependencies
npm update

# Restart services
pm2 restart all

# Check for security vulnerabilities
npm audit
```

## Support
For deployment issues, check:
1. Application logs
2. Server resource usage
3. Database connectivity
4. Network connectivity
5. SSL certificate status 