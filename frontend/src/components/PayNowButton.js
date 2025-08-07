import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentGateway from './PaymentGateway';

const PayNowButton = ({ product, quantity = 1, className = '' }) => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const navigate = useNavigate();

  const handlePaymentSuccess = (paymentData) => {
    console.log('✅ Payment successful:', paymentData);
    setPaymentStatus(`✅ Payment successful! Order ID: ${paymentData.orderId}`);
    
    // Show success message
    alert('Payment successful! Your order has been placed.');
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('payment-successful', {
      detail: { payment: paymentData }
    }));

    // Navigate to profile or orders page
    navigate('/profile');
  };

  const handlePaymentFailure = (error) => {
    console.error('❌ Payment failed:', error);
    setPaymentStatus(`❌ Payment failed: ${error}`);
    alert('Payment failed. Please try again.');
  };

  const getCustomerDetails = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    return {
      name: user ? user.name : '',
      email: user ? user.email : '',
      phone: user ? user.phone : ''
    };
  };

  return (
    <div className={className}>
      <PaymentGateway
        amount={product.price * quantity}
        currency="INR"
        productName={product.name}
        productDescription={`${product.name} - Quantity: ${quantity}`}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        customerDetails={getCustomerDetails()}
        serverUrl="http://localhost:5000/api/payments"
        buttonText="Pay Now"
        buttonStyle={{
          backgroundColor: '#FF6B6B',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        showAmount={true}
        companyName="Manvi Fashion"
        companyLogo="https://via.placeholder.com/150x50/FF6B6B/FFFFFF?text=Manvi"
      />
      
      {paymentStatus && (
        <p className="text-sm mt-2 text-center">
          {paymentStatus}
        </p>
      )}
    </div>
  );
};

export default PayNowButton; 