import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';

const Checkout = ({ items, source = 'cart' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();

  useEffect(() => {
    // Pre-fill form with user data if available
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || ''
      }));
    }
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => {
        setError('Failed to load Razorpay');
        resolve();
      };
      document.body.appendChild(script);
    });
  };

  const calculateTotal = () => {
    console.log('🔍 Calculating total for items:', items);
    const total = items.reduce((total, item) => {
      // Handle both cart and wishlist item structures
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 1;
      console.log(`📦 Item: ${item.product?.name || item.name}, Price: ${price}, Quantity: ${quantity}`);
      return total + (price * quantity);
    }, 0);
    console.log('💰 Total calculated:', total);
    return total;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (let field of required) {
      if (!formData[field].trim()) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to make a payment');
        navigate('/login');
        return;
      }

      // Validate form
      if (!validateForm()) {
        return;
      }

      // Load Razorpay script
      await loadRazorpayScript();

      // Create Razorpay order
      const totalAmount = calculateTotal();
      console.log('💳 Creating payment order with amount:', totalAmount);
      
      const orderData = {
        amount: totalAmount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          source,
          itemCount: items.length,
          shippingAddress: formData
        }
      };
      console.log('📤 Sending order data to backend:', orderData);
      
      const response = await axios.post('http://localhost:5000/api/payments/create-order', orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { order } = response.data;

      // Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_live_your_razorpay_key_id',
        amount: order.amount,
        currency: order.currency,
        name: 'Manvi Fashion',
        description: `Checkout for ${items.length} items`,
        image: 'https://via.placeholder.com/150x50/FF6B6B/FFFFFF?text=Manvi',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Process payment on backend
            const paymentResponse = await axios.post('http://localhost:5000/api/payments/process', {
              razorpayOrderId: order.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              amount: totalAmount / 100,
              description: `Checkout payment for ${items.length} items`,
              items: items.map(item => ({
                product: item.product?._id || item._id || item.product,
                name: item.product?.name || item.name,
                price: item.product?.price || item.price,
                quantity: item.quantity || 1
              })),
              shippingAddress: formData,
              paymentMethod: 'razorpay'
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            console.log('✅ Checkout payment successful:', paymentResponse.data);
            
            // Clear cart/wishlist
            if (source === 'cart') {
              clearCart();
            } else if (source === 'wishlist') {
              clearWishlist();
            }
            
            // Show success message
            alert('Payment successful! Your order has been placed.');
            
            // Dispatch event for real-time updates
            window.dispatchEvent(new CustomEvent('payment-successful', {
              detail: { 
                payment: paymentResponse.data.payment,
                order: paymentResponse.data.order 
              }
            }));

            // Import and use WebSocket service for real-time updates
            import('../services/websocket.js').then(({ default: websocketService }) => {
              websocketService.emitOrderUpdate(paymentResponse.data.order);
              websocketService.emitPaymentUpdate(paymentResponse.data.payment);
            }).catch(err => {
              console.log('WebSocket service not available, using custom events only');
            });

            // Navigate to profile
            navigate('/profile');

          } catch (error) {
            console.error('❌ Payment processing error:', error);
            setError('Payment processing failed. Please try again.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#FF6B6B'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      // Open Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('❌ Checkout error:', error);
      setError('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>
      
      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-2">
          {items.map((item, index) => {
            const itemName = item.product?.name || item.name;
            const itemPrice = item.product?.price || item.price || 0;
            const itemQuantity = item.quantity || 1;
            return (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{itemName}</p>
                  <p className="text-sm text-gray-600">Qty: {itemQuantity}</p>
                </div>
                <p className="font-semibold text-gray-900">₹{itemPrice * itemQuantity}</p>
              </div>
            );
          })}
          <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
            <p className="text-lg font-bold text-gray-900">Total</p>
            <p className="text-lg font-bold text-gray-900">₹{calculateTotal()}</p>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="flex justify-center">
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pay ₹{calculateTotal()}
            </>
          )}
        </button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
      )}
    </div>
  );
};

export default Checkout; 