const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  processPayment,
  getPaymentDetails,
  getAllPayments,
  getUserPayments,
  refundPayment
} = require('../controllers/payment');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/create-order', createRazorpayOrder);
router.post('/validate-payment', processPayment);

// Protected routes (require authentication)
router.get('/user-payments', protect, getUserPayments);
router.get('/order/:orderId', getPaymentDetails);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllPayments);
router.post('/admin/refund', protect, authorize('admin'), refundPayment);

module.exports = router; 