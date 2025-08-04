const mongoose = require('mongoose');
const Subcategory = require('../models/Subcategory');
require('dotenv').config();

const defaultSubcategories = [
  // Dresses
  { name: 'Dresses', category: 'clothing', description: 'Various types of dresses', sortOrder: 1 },
  { name: 'Sarees', category: 'clothing', description: 'Traditional Indian sarees', sortOrder: 2 },
  { name: 'Kurtis', category: 'clothing', description: 'Indian kurtis and tunics', sortOrder: 3 },
  { name: 'Lehengas', category: 'clothing', description: 'Traditional lehengas', sortOrder: 4 },
  { name: 'Suits', category: 'clothing', description: 'Indian suits and salwar kameez', sortOrder: 5 },
  { name: 'Gowns', category: 'clothing', description: 'Evening gowns and party wear', sortOrder: 6 },
  { name: 'Anarkalis', category: 'clothing', description: 'Anarkali suits', sortOrder: 7 },
  { name: 'Palazzos', category: 'clothing', description: 'Palazzo pants and sets', sortOrder: 8 },
  { name: 'Cocktail Dresses', category: 'clothing', description: 'Cocktail and party dresses', sortOrder: 9 },
  { name: 'Bridal Wear', category: 'clothing', description: 'Bridal dresses and lehengas', sortOrder: 10 },
  
  // Accessories
  { name: 'Jewelry', category: 'accessories', description: 'Traditional and modern jewelry', sortOrder: 1 },
  { name: 'Bags', category: 'accessories', description: 'Handbags and clutches', sortOrder: 2 },
  { name: 'Scarves', category: 'accessories', description: 'Dupattas and scarves', sortOrder: 3 },
  { name: 'Belts', category: 'accessories', description: 'Fashion belts', sortOrder: 4 },
  
  // Footwear
  { name: 'Heels', category: 'footwear', description: 'High heels and stilettos', sortOrder: 1 },
  { name: 'Flats', category: 'footwear', description: 'Comfortable flat shoes', sortOrder: 2 },
  { name: 'Sandals', category: 'footwear', description: 'Summer sandals', sortOrder: 3 },
  { name: 'Wedges', category: 'footwear', description: 'Wedge heels', sortOrder: 4 }
];

const initializeSubcategories = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing subcategories
    await Subcategory.deleteMany({});
    console.log('Cleared existing subcategories');
    
    // Insert default subcategories
    const createdSubcategories = await Subcategory.insertMany(defaultSubcategories);
    console.log(`Created ${createdSubcategories.length} default subcategories`);
    
    // Display created subcategories
    console.log('\nCreated subcategories:');
    createdSubcategories.forEach(sub => {
      console.log(`- ${sub.name} (${sub.category})`);
    });
    
    console.log('\nSubcategories initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing subcategories:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeSubcategories(); 