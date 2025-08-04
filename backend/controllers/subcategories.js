const Subcategory = require('../models/Subcategory');

// Get all subcategories
const getSubcategories = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const subcategories = await Subcategory.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .select('name category description isActive sortOrder');
    
    res.status(200).json({
      success: true,
      data: subcategories,
      count: subcategories.length
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subcategories',
      error: error.message
    });
  }
};

// Get subcategory by ID
const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: subcategory
    });
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subcategory',
      error: error.message
    });
  }
};

// Create new subcategory
const createSubcategory = async (req, res) => {
  try {
    console.log('Creating subcategory with data:', req.body);
    console.log('User making request:', req.user);
    
    const { name, category, description, sortOrder } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name is required'
      });
    }
    
    // Check if subcategory already exists
    const existingSubcategory = await Subcategory.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingSubcategory) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory with this name already exists'
      });
    }
    
    const subcategoryData = {
      name,
      category: category || 'clothing',
      description: description || '',
      sortOrder: sortOrder || 0
    };
    
    console.log('Creating subcategory with data:', subcategoryData);
    
    const subcategory = await Subcategory.create(subcategoryData);
    
    console.log('Subcategory created successfully:', subcategory);
    
    res.status(201).json({
      success: true,
      data: subcategory,
      message: 'Subcategory created successfully'
    });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subcategory',
      error: error.message
    });
  }
};

// Update subcategory
const updateSubcategory = async (req, res) => {
  try {
    const { name, category, description, isActive, sortOrder } = req.body;
    
    // Check if name is being changed and if it already exists
    if (name) {
      const existingSubcategory = await Subcategory.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (existingSubcategory) {
        return res.status(400).json({
          success: false,
          message: 'Subcategory with this name already exists'
        });
      }
    }
    
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        description,
        isActive,
        sortOrder
      },
      { new: true, runValidators: true }
    );
    
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: subcategory,
      message: 'Subcategory updated successfully'
    });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subcategory',
      error: error.message
    });
  }
};

// Delete subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subcategory',
      error: error.message
    });
  }
};

// Bulk operations
const bulkUpdateSubcategories = async (req, res) => {
  try {
    const { operations } = req.body; // Array of { id, action, data }
    
    const results = [];
    
    for (const operation of operations) {
      try {
        switch (operation.action) {
          case 'update':
            const updated = await Subcategory.findByIdAndUpdate(
              operation.id,
              operation.data,
              { new: true }
            );
            results.push({ id: operation.id, success: true, data: updated });
            break;
            
          case 'delete':
            await Subcategory.findByIdAndDelete(operation.id);
            results.push({ id: operation.id, success: true, action: 'deleted' });
            break;
            
          default:
            results.push({ id: operation.id, success: false, error: 'Invalid action' });
        }
      } catch (error) {
        results.push({ id: operation.id, success: false, error: error.message });
      }
    }
    
    res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error in bulk operations:', error);
    res.status(500).json({
      success: false,
      message: 'Error in bulk operations',
      error: error.message
    });
  }
};

module.exports = {
  getSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  bulkUpdateSubcategories
}; 