import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaDollarSign,
  FaChartLine,
  FaExclamationTriangle,
  FaSync,
  FaTags
} from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState({
    addProduct: false,
    viewUsers: false,
    processOrders: false
  });

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for payment success events
    const handlePaymentSuccess = (event) => {
      console.log('Payment successful, refreshing dashboard...');
      setTimeout(() => {
        fetchDashboardData();
      }, 1000); // Small delay to ensure backend has processed the order
    };

    window.addEventListener('payment-successful', handlePaymentSuccess);
    
    // Poll for new data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => {
      window.removeEventListener('payment-successful', handlePaymentSuccess);
      clearInterval(interval);
    };
  }, []);

  // Add event listeners for real-time updates
  useEffect(() => {
    const handleUserRegistered = (event) => {
      console.log('User registered, updating dashboard:', event.detail);
      fetchDashboardData(); // Refresh dashboard data
    };

    const handleUserLoggedIn = (event) => {
      console.log('User logged in, updating dashboard:', event.detail);
      fetchDashboardData(); // Refresh dashboard data
    };

    // Listen for user events
    window.addEventListener('user-registered', handleUserRegistered);
    window.addEventListener('user-logged-in', handleUserLoggedIn);
    
    return () => {
      window.removeEventListener('user-registered', handleUserRegistered);
      window.removeEventListener('user-logged-in', handleUserLoggedIn);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch statistics
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/users?limit=1', config),
        axios.get('http://localhost:5000/api/products?limit=1', config),
        axios.get('http://localhost:5000/api/orders?limit=1', config)
      ]);

      setStats({
        totalUsers: usersRes.data.pagination?.total || 0,
        totalProducts: productsRes.data.pagination?.total || 0,
        totalOrders: ordersRes.data.pagination?.total || 0,
        totalRevenue: 0 // Calculate from orders
      });

      // Fetch recent orders
      const recentOrdersRes = await axios.get('http://localhost:5000/api/orders?limit=5', config);
      setRecentOrders(recentOrdersRes.data.data || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Quick Action Handlers
  const handleAddNewProduct = () => {
    setButtonLoading(prev => ({ ...prev, addProduct: true }));
    setTimeout(() => {
      navigate('/admin/products');
      setButtonLoading(prev => ({ ...prev, addProduct: false }));
    }, 200);
  };

  const handleViewAllUsers = () => {
    setButtonLoading(prev => ({ ...prev, viewUsers: true }));
    setTimeout(() => {
      navigate('/admin/users');
      setButtonLoading(prev => ({ ...prev, viewUsers: false }));
    }, 200);
  };

  const handleProcessOrders = () => {
    setButtonLoading(prev => ({ ...prev, processOrders: true }));
    setTimeout(() => {
      navigate('/admin/orders');
      setButtonLoading(prev => ({ ...prev, processOrders: false }));
    }, 200);
  };

  const handleOrderClick = (orderId) => {
    navigate(`/admin/orders?orderId=${orderId}`);
  };

  const handleRefreshDashboard = () => {
    setLoading(true);
    fetchDashboardData();
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center">
              <FaChartLine className="mr-1" size={12} />
              +{change}%
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const OrderStatusBadge = ({ status }) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>
        <button
          onClick={handleRefreshDashboard}
          disabled={loading}
          className={`px-4 py-2 rounded-lg border border-gray-300 transition-colors ${
            loading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <FaSync className={`text-indigo-500 mr-2 ${loading ? 'animate-spin' : ''}`} size={14} />
            <span className="text-sm font-medium">{loading ? 'Refreshing...' : 'Refresh'}</span>
          </div>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FaUsers}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={FaBox}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={FaShoppingCart}
          color="bg-purple-500"
          change={15}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={FaDollarSign}
          color="bg-yellow-500"
          change={23}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleOrderClick(order._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.totalPrice?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={handleAddNewProduct}
              disabled={buttonLoading.addProduct}
              className={`w-full text-left p-3 rounded-lg border border-gray-200 transition-colors cursor-pointer ${
                buttonLoading.addProduct ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <FaBox className="text-blue-500 mr-3" size={16} />
                <span>{buttonLoading.addProduct ? 'Loading...' : 'Add New Product'}</span>
              </div>
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <FaBox className="text-green-500 mr-3" size={16} />
                <span>View All Products</span>
              </div>
            </button>
            <button 
              onClick={handleViewAllUsers}
              disabled={buttonLoading.viewUsers}
              className={`w-full text-left p-3 rounded-lg border border-gray-200 transition-colors cursor-pointer ${
                buttonLoading.viewUsers ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <FaUsers className="text-green-500 mr-3" size={16} />
                <span>{buttonLoading.viewUsers ? 'Loading...' : 'View All Users'}</span>
              </div>
            </button>
            <button 
              onClick={handleProcessOrders}
              disabled={buttonLoading.processOrders}
              className={`w-full text-left p-3 rounded-lg border border-gray-200 transition-colors cursor-pointer ${
                buttonLoading.processOrders ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <FaShoppingCart className="text-purple-500 mr-3" size={16} />
                <span>{buttonLoading.processOrders ? 'Loading...' : 'Process Orders'}</span>
              </div>
            </button>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <FaShoppingCart className="text-orange-500 mr-3" size={16} />
                <span>View All Orders</span>
              </div>
            </button>
            <button 
              onClick={() => navigate('/admin/subcategories')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <FaTags className="text-teal-500 mr-3" size={16} />
                <span>Manage Subcategories</span>
              </div>
            </button>
            <button 
              onClick={handleRefreshDashboard}
              disabled={loading}
              className={`w-full text-left p-3 rounded-lg border border-gray-200 transition-colors cursor-pointer ${
                loading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <FaSync className={`text-indigo-500 mr-3 ${loading ? 'animate-spin' : ''}`} size={16} />
                <span>{loading ? 'Refreshing...' : 'Refresh Dashboard'}</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Server</span>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">File Storage</span>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 