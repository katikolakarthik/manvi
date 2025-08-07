const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/Product'); // Added missing import

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Order Endpoint
exports.createRazorpayOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const { amount, currency = "INR", receipt, notes = {} } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ 
        error: "Amount is required" 
      });
    }

    const orderOptions = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes
    };

    console.log("Creating order with options:", orderOptions);
    
    const order = await razorpay.orders.create(orderOptions);

    console.log("Order created successfully:", order.id);
    res.json({
      success: true,
      order: order
    });

  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ 
      error: "Failed to create order", 
      details: err.message 
    });
  }
});

// Validate Payment Endpoint
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      amount,
      orderId,
      description,
      items,
      shippingAddress,
      paymentMethod = 'razorpay'
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        error: "Missing payment verification parameters" 
      });
    }

    console.log("Validating payment:", { razorpay_order_id, razorpay_payment_id });

    // Verify signature
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    
    if (digest !== razorpay_signature) {
      console.error("Signature validation failed");
      return res.status(400).json({ 
        error: "Payment verification failed" 
      });
    }

    // Find or create order
    let order;
    if (orderId) {
      order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
    } else {
      // Create a new order with complete details
      const orderItemsWithDetails = items ? await Promise.all(
        items.map(async (item) => {
          const product = await Product.findById(item.product);
          if (!product) {
            throw new Error(`Product not found: ${item.product}`);
          }
          return {
            product: item.product,
            name: product.name,
            quantity: item.quantity,
            price: product.discountedPrice || product.price,
            image: product.images[0]
          };
        })
      ) : [];

      // Calculate totals
      const itemsPrice = orderItemsWithDetails.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      const taxPrice = itemsPrice * 0.1; // 10% tax
      const shippingPrice = itemsPrice > 50 ? 0 : 10; // Free shipping over $50
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      order = new Order({
        user: req.user ? req.user.id : 'guest',
        orderItems: orderItemsWithDetails,
        shippingAddress: shippingAddress || {
          street: 'N/A',
          city: 'N/A',
          state: 'N/A',
          zipCode: 'N/A',
          country: 'N/A'
        },
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        status: 'pending',
        isPaid: false
      });

      await order.save();

      // Update product stock
      if (orderItemsWithDetails.length > 0) {
        await Promise.all(
          orderItemsWithDetails.map(async (item) => {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: -item.quantity }
            });
          })
        );
      }
    }

    // Create payment record
    const payment = new Payment({
      user: req.user ? req.user.id : 'guest',
      order: order._id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: amount,
      currency: 'INR',
      status: 'completed',
      description: description || 'Payment for order',
      receipt: `receipt_${Date.now()}`
    });

    await payment.save();

    // Update order status and payment info
    order.status = 'processing';
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'completed',
      update_time: new Date().toISOString(),
      email_address: req.user ? req.user.email : 'guest@example.com'
    };
    await order.save();

    console.log("Payment validated successfully and order created:", order._id);
    
    // Return complete order and payment details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    res.json({
      success: true,
      message: "Payment verified successfully and order created",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      payment: {
        id: payment._id,
        razorpayPaymentId,
        amount,
        status: payment.status,
        orderId: order._id
      },
      order: populatedOrder
    });

  } catch (err) {
    console.error("Error validating payment:", err);
    res.status(500).json({ 
      error: "Failed to validate payment", 
      details: err.message 
    });
  }
});

// Get Order Details Endpoint
exports.getPaymentDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await razorpay.orders.fetch(orderId);
    
    res.json({
      success: true,
      order
    });

  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ 
      error: "Failed to fetch order", 
      details: err.message 
    });
  }
});

// Get All Payments (Admin)
exports.getAllPayments = catchAsyncErrors(async (req, res, next) => {
  const payments = await Payment.find()
    .populate('user', 'name email')
    .populate('order')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    payments
  });
});

// Get User Payments
exports.getUserPayments = catchAsyncErrors(async (req, res, next) => {
  const payments = await Payment.find({ user: req.user.id })
    .populate('order')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    payments
  });
});

// Refund Payment
exports.refundPayment = catchAsyncErrors(async (req, res, next) => {
  const { paymentId, amount, reason } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return next(new ErrorHandler('Payment not found', 404));
  }

  if (payment.status !== 'completed') {
    return next(new ErrorHandler('Payment cannot be refunded', 400));
  }

  try {
    const refundAmount = amount || payment.amount;
    
    const refund = await razorpay.payments.refund(
      payment.razorpayPaymentId,
      {
        amount: refundAmount * 100, // Convert to paise
        notes: {
          reason: reason || 'Refund requested'
        }
      }
    );

    payment.status = 'refunded';
    payment.refundId = refund.id;
    payment.refundAmount = refundAmount;
    payment.refundReason = reason;
    await payment.save();

    console.log('✅ Payment refunded successfully');
    console.log(`💰 Refund ID: ${refund.id}`);
    console.log(`💸 Refund Amount: ${refundAmount}`);

    res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      refund: {
        id: refund.id,
        amount: refundAmount,
        reason
      }
    });
  } catch (error) {
    console.error('❌ Error refunding payment:', error);
    return next(new ErrorHandler('Error refunding payment', 500));
  }
}); 