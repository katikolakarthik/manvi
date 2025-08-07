import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaUndo, FaDownload, FaFilter } from 'react-icons/fa';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  // Add event listener for payment updates
  useEffect(() => {
    const handlePaymentSuccessful = (event) => {
      console.log('Payment successful, updating payments list:', event.detail);
      fetchPayments();
    };

    window.addEventListener('payment-successful', handlePaymentSuccessful);
    
    return () => {
      window.removeEventListener('payment-successful', handlePaymentSuccessful);
    };
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/payments/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPayments(response.data.payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (paymentId, amount) => {
    if (!window.confirm('Are you sure you want to refund this payment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/payments/admin/refund', {
        paymentId,
        amount,
        reason: 'Refund requested by admin'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Payment refunded successfully!');
      fetchPayments();
    } catch (error) {
      console.error('Error refunding payment:', error);
      alert('Failed to refund payment. Please try again.');
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesSearch = payment.razorpayPaymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Manage all payment transactions</p>
        </div>
        <button
          onClick={fetchPayments}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaDownload className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search by payment ID, user name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.razorpayPaymentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.user?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.user?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(payment)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {payment.status === 'completed' && (
                          <button
                            onClick={() => handleRefund(payment._id, payment.amount)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Refund Payment"
                          >
                            <FaUndo />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Payment ID:</span>
                  <p className="text-sm text-gray-600">{selectedPayment.razorpayPaymentId}</p>
                </div>
                <div>
                  <span className="font-medium">Order ID:</span>
                  <p className="text-sm text-gray-600">{selectedPayment.razorpayOrderId}</p>
                </div>
                <div>
                  <span className="font-medium">Amount:</span>
                  <p className="text-sm text-gray-600">₹{selectedPayment.amount}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-sm text-gray-600">{selectedPayment.status}</p>
                </div>
                <div>
                  <span className="font-medium">User:</span>
                  <p className="text-sm text-gray-600">{selectedPayment.user?.name} ({selectedPayment.user?.email})</p>
                </div>
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="text-sm text-gray-600">{selectedPayment.description}</p>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <p className="text-sm text-gray-600">{formatDate(selectedPayment.createdAt)}</p>
                </div>
                {selectedPayment.refundId && (
                  <div>
                    <span className="font-medium">Refund ID:</span>
                    <p className="text-sm text-gray-600">{selectedPayment.refundId}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredPayments.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No payments found</p>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement; 