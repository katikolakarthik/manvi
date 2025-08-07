import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimes, FaShoppingBag } from 'react-icons/fa';

const OrderNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handlePaymentSuccess = (event) => {
      const { order, payment } = event.detail;
      
      const notification = {
        id: Date.now(),
        type: 'success',
        title: 'Order Placed Successfully!',
        message: `Your order #${order._id.slice(-6)} has been placed and payment completed.`,
        order: order,
        payment: payment,
        timestamp: new Date()
      };

      setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications

      // Auto-remove notification after 10 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 10000);
    };

    window.addEventListener('payment-successful', handlePaymentSuccess);

    return () => {
      window.removeEventListener('payment-successful', handlePaymentSuccess);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out ${
            notification.type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
          }`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <FaCheckCircle className="h-6 w-6 text-green-400" />
                ) : (
                  <FaShoppingBag className="h-6 w-6 text-blue-400" />
                )}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
                {notification.order && (
                  <div className="mt-2 text-xs text-gray-400">
                    Order Total: ${notification.order.totalPrice?.toFixed(2)}
                    <br />
                    Items: {notification.order.orderItems?.length || 0}
                  </div>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => removeNotification(notification.id)}
                >
                  <span className="sr-only">Close</span>
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderNotification; 