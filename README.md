# Manvi - E-commerce Platform

A full-stack MERN e-commerce application with real-time order management, payment processing, and admin dashboard.

## 🚀 Features

### User Features
- **Product Browsing**: Browse products by category and subcategory
- **Shopping Cart**: Add/remove items with real-time updates
- **Wishlist**: Save favorite products for later
- **Secure Checkout**: Integrated Razorpay payment gateway
- **Order Tracking**: Real-time order status updates
- **User Profile**: Manage personal information and view order history

### Admin Features
- **Dashboard**: Analytics and overview
- **Product Management**: CRUD operations for products
- **Order Management**: Process and track orders
- **User Management**: Manage customer accounts
- **Payment Management**: Monitor payment transactions
- **Subcategory Management**: Organize product categories

### Technical Features
- **Real-time Updates**: Custom events and polling for live updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Security**: JWT authentication, rate limiting, input validation
- **Performance**: Optimized builds, compression, caching
- **Scalability**: Modular architecture, PM2 clustering

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Razorpay** - Payment gateway integration

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Winston** - Logging
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js 16+
- MongoDB
- Razorpay account

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/manvi
JWT_SECRET=your-super-secret-jwt-key
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_live_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_RAZORPAY_KEY_ID=rzp_live_your_key_id
REACT_APP_ENVIRONMENT=production
```

## 🚀 Deployment

### Quick Start
1. Set up environment variables
2. Install dependencies: `npm install`
3. Build frontend: `npm run build`
4. Start backend: `npm run prod`

### Production Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

## 📁 Project Structure

```
manvi/
├── backend/
│   ├── config/          # Database and logger configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Setup and utility scripts
│   ├── uploads/         # File uploads
│   └── utils/           # Utility functions
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # React components
│       ├── context/     # React context providers
│       └── services/    # API services
└── docs/               # Documentation
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent abuse with request limiting
- **Input Validation**: Comprehensive validation using Joi
- **CORS Protection**: Configured cross-origin requests
- **Security Headers**: Helmet.js for security headers
- **File Upload Security**: Validated file uploads

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/orders` - Create order

### Payments
- `POST /api/payments/process` - Process payment

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Performance

### Optimizations
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed and optimized images
- **Bundle Optimization**: Minimized production builds
- **Caching**: Browser and server-side caching
- **Compression**: Gzip compression enabled

### Monitoring
- **Error Logging**: Winston logger with file rotation
- **Performance Monitoring**: PM2 process monitoring
- **Health Checks**: `/health` endpoint for monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
2. Review the logs in `backend/logs/`
3. Check the browser console for frontend errors
4. Verify environment variables are correctly set

## 🔄 Updates

### Recent Updates
- ✅ Real-time order management
- ✅ Payment gateway integration
- ✅ Admin dashboard
- ✅ User profile management
- ✅ Production optimizations
- ✅ Security enhancements

### Roadmap
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced search filters
