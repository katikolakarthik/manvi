const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // Use hardcoded URI for now
    const MONGODB_URI = 'mongodb+srv://bunny:bunny123@cluster0.prok7pl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB successfully!');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@monvistyles.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('Admin user ID:', existingAdmin._id);
      console.log('Admin user role:', existingAdmin.role);
      process.exit(0);
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123456', 12);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@monvistyles.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@monvistyles.com');
    console.log('Password: admin123456');
    console.log('User ID:', adminUser._id);
    console.log('Role:', adminUser.role);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser(); 