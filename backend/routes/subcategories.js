const express = require('express');
const router = express.Router();
const {
  getSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  bulkUpdateSubcategories
} = require('../controllers/subcategories');
const { protect, authorize } = require('../middleware/auth');

// Public routes (for frontend to get subcategories)
router.get('/', getSubcategories);
router.get('/:id', getSubcategoryById);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', createSubcategory);
router.put('/:id', updateSubcategory);
router.delete('/:id', deleteSubcategory);
router.post('/bulk', bulkUpdateSubcategories);

module.exports = router; 