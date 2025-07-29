# Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints (`/api/auth`)

### Public Routes

#### 1. Register User
- **POST** `/api/auth/register`
- **Description**: Create a new user account
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

#### 2. Login User
- **POST** `/api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: Same as register

#### 3. Logout User
- **POST** `/api/auth/logout`
- **Description**: Logout user (clears token)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

#### 4. Forgot Password
- **POST** `/api/auth/forgot-password`
- **Description**: Send password reset email
- **Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```

#### 5. Reset Password
- **POST** `/api/auth/reset-password/:resetToken`
- **Description**: Reset password using token
- **Body**:
  ```json
  {
    "password": "newpassword123"
  }
  ```

### Protected Routes (Require Authentication)

#### 6. Get Current User
- **GET** `/api/auth/me`
- **Description**: Get current user profile
- **Headers**: `Authorization: Bearer <token>`

#### 7. Update Profile
- **PUT** `/api/auth/update-profile`
- **Description**: Update user profile
- **Body**:
  ```json
  {
    "name": "John Updated",
    "phone": "+1234567890"
  }
  ```

#### 8. Update Password
- **PUT** `/api/auth/update-password`
- **Description**: Change user password
- **Body**:
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
  }
  ```

### Admin Routes (Require Admin Role)

#### 9. Get All Users
- **GET** `/api/auth/users`
- **Description**: Get all users (admin only)
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `role`: Filter by role (user/admin)
  - `isActive`: Filter by active status

#### 10. Get User by ID
- **GET** `/api/auth/users/:id`
- **Description**: Get specific user details

#### 11. Update User
- **PUT** `/api/auth/users/:id`
- **Description**: Update user details (admin only)
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "admin"
  }
  ```

#### 12. Delete User
- **DELETE** `/api/auth/users/:id`
- **Description**: Delete user (admin only)

---

## 👥 User Management Endpoints (`/api/users`)

### Protected Routes (Require Authentication)

#### 1. Get User Profile
- **GET** `/api/users/profile`
- **Description**: Get current user's profile

#### 2. Update User Profile
- **PUT** `/api/users/profile`
- **Description**: Update current user's profile
- **Body**:
  ```json
  {
    "name": "John Doe",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }
  ```

#### 3. Get User Orders
- **GET** `/api/users/orders`
- **Description**: Get current user's orders

### Admin Routes (Require Admin Role)

#### 4. Get All Users
- **GET** `/api/users`
- **Description**: Get all users with pagination
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `role`: Filter by role
  - `isActive`: Filter by status

#### 5. Get User by ID
- **GET** `/api/users/:id`
- **Description**: Get specific user

#### 6. Create User
- **POST** `/api/users`
- **Description**: Create new user (admin only)
- **Body**:
  ```json
  {
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "role": "user"
  }
  ```

#### 7. Update User
- **PUT** `/api/users/:id`
- **Description**: Update user (admin only)

#### 8. Delete User
- **DELETE** `/api/users/:id`
- **Description**: Delete user (admin only)

---

## 🛍️ Product Endpoints (`/api/products`)

### Public Routes

#### 1. Get All Products
- **GET** `/api/products`
- **Description**: Get all products with filtering and pagination
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `category`: Filter by category
  - `sort`: Sort by (price, -price, name, -name, createdAt, -createdAt)
  - `minPrice`: Minimum price filter
  - `maxPrice`: Maximum price filter

#### 2. Get Product by ID
- **GET** `/api/products/:id`
- **Description**: Get specific product details

#### 3. Get Featured Products
- **GET** `/api/products/featured`
- **Description**: Get featured products

#### 4. Search Products
- **GET** `/api/products/search?q=search_term`
- **Description**: Search products by name, description, or material
- **Query Parameters**:
  - `q`: Search query (required)
  - `page`: Page number
  - `limit`: Items per page

#### 5. Get Products by Category
- **GET** `/api/products/category/:category`
- **Description**: Get products filtered by category
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page

#### 6. Get Product Reviews
- **GET** `/api/products/:id/reviews`
- **Description**: Get reviews for a specific product

#### 7. Initialize Data
- **POST** `/api/products/initialize-data`
- **Description**: Initialize sample data for frontend

### Cart Endpoints (Simplified for Demo)

#### 8. Get Cart
- **GET** `/api/products/cart`
- **Description**: Get cart items (returns empty array for demo)

#### 9. Add to Cart
- **POST** `/api/products/cart`
- **Description**: Add item to cart
- **Body**:
  ```json
  {
    "product_id": "product_id",
    "quantity": 1,
    "size": "M"
  }
  ```

#### 10. Remove from Cart
- **DELETE** `/api/products/cart/:id`
- **Description**: Remove item from cart

#### 11. Update Cart Item
- **PUT** `/api/products/cart/:id`
- **Description**: Update cart item quantity

### Protected Routes (Require Authentication)

#### 12. Add Product Review
- **POST** `/api/products/:id/reviews`
- **Description**: Add review to product
- **Body**:
  ```json
  {
    "rating": 5,
    "review": "Great product!"
  }
  ```

### Admin Routes (Require Admin Role)

#### 13. Create Product
- **POST** `/api/products`
- **Description**: Create new product
- **Body**:
  ```json
  {
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "originalPrice": 129.99,
    "category": "clothing",
    "subcategory": "dresses",
    "brand": "Brand Name",
    "images": ["image1.jpg", "image2.jpg"],
    "stock": 100,
    "sku": "SKU123",
    "weight": 0.5,
    "tags": ["tag1", "tag2"],
    "isActive": true,
    "isFeatured": true,
    "discount": 10,
    "material": "Cotton",
    "pattern": "Solid",
    "color": "Blue",
    "occasion": "Casual",
    "sleeve_type": "Short Sleeve",
    "neck_type": "Round Neck",
    "fabric": "Cotton",
    "wash_care": "Machine wash",
    "silhouette": "A-Line",
    "length": "Knee Length",
    "sizes": ["S", "M", "L", "XL"],
    "size_guide": [
      {
        "size": "S",
        "bust": "32",
        "waist": "26"
      }
    ]
  }
  ```

#### 14. Update Product
- **PUT** `/api/products/:id`
- **Description**: Update product
- **Body**: Same as create (all fields optional)

#### 15. Delete Product
- **DELETE** `/api/products/:id`
- **Description**: Delete product

#### 16. Upload Product Image
- **POST** `/api/products/:id/upload-image`
- **Description**: Upload product image
- **Content-Type**: `multipart/form-data`

---

## 📦 Order Endpoints (`/api/orders`)

### Protected Routes (Require Authentication)

#### 1. Get My Orders
- **GET** `/api/orders/my-orders`
- **Description**: Get current user's orders
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page (max 50)
  - `status`: Filter by status

#### 2. Get My Order by ID
- **GET** `/api/orders/my-orders/:id`
- **Description**: Get specific order for current user

#### 3. Create Order
- **POST** `/api/orders`
- **Description**: Create new order
- **Body**:
  ```json
  {
    "orderItems": [
      {
        "product": "product_id",
        "quantity": 2,
        "size": "M"
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "credit_card",
    "notes": "Delivery instructions",
    "couponCode": "SAVE10"
  }
  ```

#### 4. Cancel Order
- **PUT** `/api/orders/my-orders/:id/cancel`
- **Description**: Cancel order (user can only cancel pending orders)

### Admin Routes (Require Admin Role)

#### 5. Get All Orders
- **GET** `/api/orders`
- **Description**: Get all orders with filtering
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page (max 100)
  - `status`: Filter by status
  - `sort`: Sort by (createdAt, -createdAt, totalPrice, -totalPrice)
  - `startDate`: Filter by start date
  - `endDate`: Filter by end date

#### 6. Get Order by ID
- **GET** `/api/orders/:id`
- **Description**: Get specific order details

#### 7. Update Order
- **PUT** `/api/orders/:id`
- **Description**: Update order details
- **Body**:
  ```json
  {
    "status": "shipped",
    "trackingNumber": "TRK123456",
    "notes": "Order shipped",
    "isPaid": true,
    "isDelivered": false,
    "shippingAddress": {
      "street": "Updated Address",
      "city": "Updated City",
      "state": "Updated State",
      "zipCode": "12345",
      "country": "Updated Country"
    }
  }
  ```

#### 8. Update Order Status
- **PATCH** `/api/orders/:id/status`
- **Description**: Update order status
- **Body**:
  ```json
  {
    "status": "shipped",
    "trackingNumber": "TRK123456",
    "notes": "Order shipped"
  }
  ```

#### 9. Delete Order
- **DELETE** `/api/orders/:id`
- **Description**: Delete order (admin only)

---

## 🔧 Health Check

#### Health Check
- **GET** `/health`
- **Description**: Check if server is running
- **Response**:
  ```json
  {
    "status": "OK",
    "message": "Server is running",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "development"
  }
  ```

---

## 📊 Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🔐 Authentication & Authorization

### JWT Token
- Tokens are sent in the `Authorization` header
- Format: `Bearer <token>`
- Tokens expire after 7 days by default

### User Roles
- **user**: Regular user (can view products, place orders)
- **admin**: Administrator (full access to all endpoints)

### Protected Routes
- Routes marked as "Protected" require valid JWT token
- Routes marked as "Admin" require admin role

---

## 📝 Error Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set Environment Variables**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB**:
   ```bash
   # Make sure MongoDB is running
   ```

4. **Start Server**:
   ```bash
   npm start
   ```

5. **Test API**:
   ```bash
   curl http://localhost:5000/health
   ```

---

## 📋 Sample Data

The API includes sample data initialization for:
- Products (dresses, sarees with various categories)
- Users (admin and regular users)
- Orders (sample orders for testing)

Use the `/api/products/initialize-data` endpoint to populate sample data. 