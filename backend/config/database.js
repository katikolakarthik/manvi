const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    // Use environment variable for MongoDB URI or fallback to Atlas cluster
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://bunny:bunny123@cluster0.prok7pl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('Connecting to MongoDB with Mongoose...');
    console.log('MongoDB URI:', mongoURI.substring(0, 50) + '...');
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Additional options for MongoDB Atlas
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('Please make sure MongoDB is running or set MONGODB_URI in .env file');
    // Don't exit the process, just log the error
    // process.exit(1);
  }
};

module.exports = connectDB; 