// PaymentGateway.jsx
// This is a complete, reusable React component for Razorpay payment integration
// Copy this file to your React project and use it in any e-commerce website

import React, { useState } from 'react';

const PaymentGateway = ({ 
  amount, 
  currency = "INR", 
  productName = "Product", 
  productDescription = "Product Description",
  onSuccess, 
  onFailure,
  customerDetails = {},
  serverUrl = "http://localhost:5000/api/payments",
  buttonText = "Pay Now",
  buttonStyle = {},
  showAmount = true,
  companyName = "Manvi Fashion",
  companyLogo = "https://your-logo-url.com/logo.png"
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create Order
      const orderResponse = await fetch(`${serverUrl}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: `receipt_${Date.now()}`,
          notes: {
            productName,
            productDescription
          }
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const { order } = await orderResponse.json();
      console.log("Order created:", order);

      // Step 2: Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_live_your_razorpay_key_id", // Replace with your production key
        amount: order.amount,
        currency: order.currency,
        name: companyName,
        description: productDescription,
        image: companyLogo,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Validate Payment
            const validateResponse = await fetch(`${serverUrl}/validate-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!validateResponse.ok) {
              const errorData = await validateResponse.json();
              throw new Error(errorData.error || "Payment validation failed");
            }

            const validationResult = await validateResponse.json();
            console.log("Payment validated:", validationResult);

            // Call success callback
            if (onSuccess) {
              onSuccess({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: amount,
                currency: currency,
                productName: productName,
                customerDetails: customerDetails
              });
            }

          } catch (error) {
            console.error("Payment validation error:", error);
            setError(error.message);
            if (onFailure) {
              onFailure(error.message);
            }
          }
        },
        prefill: {
          name: customerDetails.name || "",
          email: customerDetails.email || "",
          contact: customerDetails.phone || "",
        },
        notes: {
          productName,
          productDescription
        },
        theme: {
          color: "#FF6B6B",
        },
      };

      // Initialize Razorpay
      const rzp = new window.Razorpay(options);

      // Handle payment failures
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        const errorMessage = `Payment failed: ${response.error.description}`;
        setError(errorMessage);
        if (onFailure) {
          onFailure(errorMessage);
        }
      });

      // Open payment modal
      rzp.open();

    } catch (error) {
      console.error("Payment initialization error:", error);
      setError(error.message);
      if (onFailure) {
        onFailure(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const defaultButtonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: loading ? '#ccc' : '#FF6B6B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    ...buttonStyle
  };

  return (
    <div className="payment-gateway">
      {error && (
        <div className="error-message" style={{ 
          color: 'red', 
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#ffe6e6',
          borderRadius: '4px',
          border: '1px solid #ffcccc'
        }}>
          ❌ {error}
        </div>
      )}
      
      <button 
        onClick={handlePayment}
        disabled={loading}
        style={defaultButtonStyle}
      >
        {loading ? '🔄 Processing...' : `${buttonText}${showAmount ? ` ₹${amount}` : ''}`}
      </button>
    </div>
  );
};

export default PaymentGateway; 