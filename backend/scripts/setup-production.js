#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Subcategory = require('../models/Subcategory');
require('dotenv').config();

const connectDB = require('../config/database');

async function setupProduction() {
  try {
    console.log('🚀 Setting up production environment...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');
    
    // Create admin user if not exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@monvistyles.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123456', 12);
      
      const adminUser = new User({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@monvistyles.com',
        password: hashedPassword,
        role: 'admin',
        phone: '1234567890',
        address: {
          street: 'Admin Street',
          city: 'Admin City',
          state: 'Admin State',
          zipCode: '12345',
          country: 'Admin Country'
        }
      });
      
      await adminUser.save();
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
    
    // Initialize subcategories if not exists
    const subcategoriesCount = await Subcategory.countDocuments();
    
    if (subcategoriesCount === 0) {
      const defaultSubcategories = [
        { name: 'Dresses', category: 'clothing', description: 'Beautiful dresses for all occasions' },
        { name: 'Tops', category: 'clothing', description: 'Stylish tops and blouses' },
        { name: 'Bottoms', category: 'clothing', description: 'Pants, skirts, and shorts' },
        { name: 'Outerwear', category: 'clothing', description: 'Jackets, coats, and sweaters' },
        { name: 'Accessories', category: 'accessories', description: 'Jewelry, bags, and scarves' },
        { name: 'Shoes', category: 'footwear', description: 'Comfortable and stylish footwear' }
      ];
      
      await Subcategory.insertMany(defaultSubcategories);
      console.log('✅ Default subcategories created');
    } else {
      console.log('ℹ️ Subcategories already exist');
    }
    
    console.log('🎉 Production setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update environment variables in .env');
    console.log('2. Configure Razorpay production keys');
    console.log('3. Set up SSL certificate');
    console.log('4. Configure domain and CORS settings');
    console.log('5. Start the server with: npm run prod');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Production setup failed:', error.message);
    process.exit(1);
  }
}

setupProduction(); 