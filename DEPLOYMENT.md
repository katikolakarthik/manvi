# 🚀 Deploying Monvi Styles to Render

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **MongoDB Atlas**: Set up a free MongoDB Atlas cluster
3. **Render Account**: Sign up at [render.com](https://render.com)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user with read/write permissions
5. Get your connection string

## Step 2: Deploy Backend

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Connect your GitHub account
   - Select your repository

3. **Configure Backend Service**
   - **Name**: `monvi-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret_key
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=7
   LOG_LEVEL=info
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   SLOW_DOWN_WINDOW_MS=900000
   SLOW_DOWN_DELAY_AFTER=1
   SLOW_DOWN_DELAY_MS=500
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://monvi-backend.onrender.com`)

## Step 3: Deploy Frontend

1. **Create New Static Site**
   - Click "New +" → "Static Site"

2. **Configure Frontend Service**
   - **Name**: `monvi-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Root Directory**: `frontend`

3. **Set Environment Variables**
   ```
   REACT_APP_BACKEND_URL=https://monvi-backend.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://monvi-frontend.onrender.com`)

## Step 4: Update Frontend Backend URL

After backend deployment, update the frontend environment variable:

1. Go to your frontend service in Render
2. Go to "Environment" tab
3. Update `REACT_APP_BACKEND_URL` with your backend URL
4. Redeploy the frontend

## Step 5: Test Your Application

1. **Frontend**: Visit your frontend URL
2. **Backend API**: Test with `https://your-backend-url.onrender.com/api/products`
3. **Admin Panel**: Visit `https://your-frontend-url.onrender.com/admin-login`

## Environment Variables Reference

### Backend Variables
- `NODE_ENV`: production
- `PORT`: 5000
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `JWT_EXPIRE`: 30d
- `JWT_COOKIE_EXPIRE`: 7
- `LOG_LEVEL`: info
- `RATE_LIMIT_WINDOW_MS`: 900000
- `RATE_LIMIT_MAX`: 100
- `SLOW_DOWN_WINDOW_MS`: 900000
- `SLOW_DOWN_DELAY_AFTER`: 1
- `SLOW_DOWN_DELAY_MS`: 500

### Frontend Variables
- `REACT_APP_BACKEND_URL`: Your backend service URL

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json

2. **CORS Errors**
   - Verify CORS configuration in backend
   - Check frontend URL is in allowed origins

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings in Atlas

4. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly

### Useful Commands

```bash
# Test backend locally
cd backend && npm start

# Test frontend locally
cd frontend && npm start

# Check build output
cd frontend && npm run build
```

## Security Notes

1. **JWT Secret**: Use a strong, random string
2. **MongoDB**: Enable network access restrictions
3. **Environment Variables**: Never commit secrets to Git
4. **HTTPS**: Render provides SSL certificates automatically

## Cost Optimization

- **Free Tier**: Both services can run on free tier
- **Auto-sleep**: Free services sleep after 15 minutes of inactivity
- **Cold starts**: First request after sleep may be slow

## Monitoring

- **Logs**: Available in Render dashboard
- **Metrics**: Basic metrics provided
- **Alerts**: Set up for downtime monitoring

## Updates

To update your application:

1. Push changes to GitHub
2. Render automatically redeploys
3. Monitor deployment logs
4. Test the updated application 