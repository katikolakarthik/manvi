# MONVI Admin Panel - Product Management

## Overview
The MONVI admin panel allows you to add, edit, and manage products that will immediately display on the frontend and be saved to the database.

## Setup Instructions

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### 3. Access Admin Panel
- Go to `http://localhost:3000/admin-login`
- Login with admin credentials:
  - **Email**: admin@monvi.com
  - **Password**: admin123

## Adding Products

### Step 1: Navigate to Product Management
1. After logging in, you'll be redirected to the admin dashboard
2. Click on "Products" in the sidebar to access Product Management

### Step 2: Add New Product
1. Click the "Add Product" button
2. Fill in the product details in the comprehensive form:

#### Basic Information
- **Product Name**: Enter the product name (required)
- **Category**: Select "clothing" (default)
- **Subcategory**: Choose from dresses, sarees, kurtis, lehengas, suits
- **Brand**: Enter brand name (defaults to "MONVI")
- **Price**: Enter the selling price in ₹
- **Original Price**: Enter original price for discount calculation
- **Discount**: Enter discount percentage (0-100)
- **Stock**: Enter available quantity
- **Active/Featured**: Toggle product visibility

#### Product Details
- **Description**: Detailed product description
- **Material**: Select from Cotton, Silk, Georgette, Rayon, Organza, Banarasi Silk
- **Pattern**: Select from Solid, Printed, Embroidered, Zari Work, Traditional Motifs
- **Color**: Choose from available colors
- **Occasion**: Select appropriate occasion (Casual, Festive, Wedding, etc.)
- **Sleeve Type**: Choose sleeve style
- **Neck Type**: Select neckline style
- **Fabric**: Select fabric type
- **Wash Care**: Choose care instructions
- **Silhouette**: Select dress shape
- **Length**: Choose dress length

#### Sizes & Size Guide
- **Available Sizes**: Add/remove sizes (XS, S, M, L, XL by default)
- **Size Guide**: Edit bust and waist measurements for each size

#### Images & Tags
- **Image URLs**: Add image URLs (one per line)
- **Tags**: Add relevant tags for search and categorization

### Step 3: Save Product
1. Click "Add Product" to save
2. The product will be immediately added to the database
3. It will appear on the frontend at `http://localhost:3000`

## Managing Products

### View Products
- All products are displayed in a table format
- Use search and category filters to find specific products

### Edit Products
1. Click the edit icon (pencil) next to any product
2. Modify the details in the form
3. Click "Update Product" to save changes

### Delete Products
1. Click the delete icon (trash) next to any product
2. Confirm deletion in the popup
3. Product will be permanently removed

## Frontend Display

Products added through the admin panel will immediately appear on:
- **Homepage**: Featured products section
- **Product Categories**: When browsing by category
- **Search Results**: When searching for products
- **Product Details**: Full product information with images, sizes, and specifications

## Sample Products

The system comes with 8 sample products including:
- Elegant Cotton Anarkali Dress
- Designer Silk Saree
- Casual Cotton Kurti
- Embroidered Georgette Dress
- Traditional Banarasi Saree
- And more...

## Features

### Real-time Updates
- Products added through admin panel immediately appear on frontend
- No need to restart servers
- Changes are saved to MongoDB database

### Comprehensive Product Details
- All clothing-specific fields included
- Size guide with measurements
- Multiple images support
- Tags for better categorization

### Admin Authentication
- Secure login system
- Role-based access control
- Session management

### Product Management
- Add, edit, delete products
- Search and filter functionality
- Bulk operations support
- Status management (Active/Inactive)

## Technical Details

### Backend API Endpoints
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products` - Get all products

### Database Schema
Products include all clothing-specific fields:
- Basic info (name, description, price, etc.)
- Clothing details (material, pattern, color, etc.)
- Sizes and size guide
- Images and tags

### Frontend Integration
- React-based admin interface
- Real-time form validation
- Responsive design
- User-friendly interface

## Troubleshooting

### Common Issues
1. **Backend not starting**: Check if MongoDB is running
2. **Login issues**: Verify admin credentials
3. **Product not appearing**: Check if product is set to "Active"
4. **Image not loading**: Verify image URLs are accessible

### Database Connection
- MongoDB should be running on `localhost:27017`
- Database name: `manvi`
- Connection string: `mongodb://localhost:27017/manvi`

## Support

For technical support or questions about the admin panel, please refer to the backend and frontend documentation in their respective directories. 