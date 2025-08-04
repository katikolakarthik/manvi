import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'clothing',
    subcategory: '',
    brand: 'MONVI',
    stock: '',
    images: [],
    tags: [],
    isActive: true,
    isFeatured: false,
    discount: 0,
    // Clothing specific fields
    material: '',
    pattern: '',
    color: '',
    occasion: '',
    sleeve_type: '',
    neck_type: '',
    fabric: '',
    wash_care: '',
    silhouette: '',
    length: '',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    size_guide: [
      { size: 'XS', bust: '32', waist: '26' },
      { size: 'S', bust: '34', waist: '28' },
      { size: 'M', bust: '36', waist: '30' },
      { size: 'L', bust: '38', waist: '32' },
      { size: 'XL', bust: '40', waist: '34' }
    ]
  });

  const categories = [
    'clothing'
  ];

  // Dynamic subcategories will be loaded from API

  const materials = ['Cotton', 'Silk', 'Georgette', 'Rayon', 'Organza', 'Banarasi Silk'];
  const patterns = ['Solid', 'Printed', 'Embroidered', 'Zari Work', 'Traditional Motifs'];
  const colors = ['Red', 'Blue', 'Green', 'Pink', 'Black', 'Gold', 'Maroon', 'Purple'];
  const occasions = ['Casual', 'Festive', 'Wedding', 'Party', 'Cultural', 'Cocktail'];
  const sleeveTypes = ['Sleeveless', 'Half Sleeve', 'Full Sleeve', 'Cap Sleeve'];
  const neckTypes = ['Round Neck', 'V-Neck', 'Sweetheart', 'Square Neck'];
  const fabrics = ['Cotton', 'Silk', 'Georgette', 'Rayon', 'Organza', 'Banarasi Silk'];
  const washCares = ['Machine Wash', 'Dry Clean Only', 'Hand Wash'];
  const silhouettes = ['A-Line', 'Straight', 'Traditional', 'Mermaid'];
  const lengths = ['Knee Length', 'Ankle Length', 'Calf Length'];

  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
  }, []);

  // Add event listener for subcategory updates
  useEffect(() => {
    const handleSubcategoryUpdate = (event) => {
      console.log('Subcategory update detected:', event.detail);
      console.log('Refreshing subcategories...');
      fetchSubcategories();
      
      // Show a brief notification
      const action = event.detail?.action || 'updated';
      const message = `Subcategories ${action}. Refreshing dropdown...`;
      console.log(message);
      
      // You can add a toast notification here if you have a notification system
      // For now, we'll just log to console
    };

    // Listen for custom events from subcategory management
    window.addEventListener('subcategory-updated', handleSubcategoryUpdate);
    
    return () => {
      window.removeEventListener('subcategory-updated', handleSubcategoryUpdate);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products?limit=50');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      setSubcategoriesLoading(true);
      console.log('Fetching subcategories...');
      const response = await axios.get('http://localhost:5000/api/subcategories?isActive=true');
      console.log('Subcategories response:', response.data);
      setSubcategories(response.data.data || []);
      console.log(`Successfully loaded ${response.data.data?.length || 0} subcategories`);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      // Try to fetch without the isActive filter as fallback
      try {
        const fallbackResponse = await axios.get('http://localhost:5000/api/subcategories');
        console.log('Fallback subcategories response:', fallbackResponse.data);
        setSubcategories(fallbackResponse.data.data || []);
      } catch (fallbackError) {
        console.error('Error in fallback subcategories fetch:', fallbackError);
      }
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        discount: parseFloat(formData.discount),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        sizes: formData.sizes.filter(size => size.trim() !== ''),
        size_guide: formData.size_guide.filter(guide => guide.size && guide.bust && guide.waist)
      };

      console.log('Submitting product data:', {
        ...submitData,
        images: submitData.images,
        imageCount: submitData.images.length
      });

      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, submitData, config);
      } else {
        await axios.post('http://localhost:5000/api/products', submitData, config);
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
      alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price ? product.price.toString() : '',
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      category: product.category || 'clothing',
      subcategory: product.subcategory || '',
      brand: product.brand || 'MONVI',
      stock: product.stock ? product.stock.toString() : '',
      images: product.images || [],
      tags: product.tags || [],
      isActive: product.isActive !== undefined ? product.isActive : true,
      isFeatured: product.isFeatured || false,
      discount: product.discount || 0,
      material: product.material || '',
      pattern: product.pattern || '',
      color: product.color || '',
      occasion: product.occasion || '',
      sleeve_type: product.sleeve_type || '',
      neck_type: product.neck_type || '',
      fabric: product.fabric || '',
      wash_care: product.wash_care || '',
      silhouette: product.silhouette || '',
      length: product.length || '',
      sizes: product.sizes || ['XS', 'S', 'M', 'L', 'XL'],
      size_guide: product.size_guide || [
        { size: 'XS', bust: '32', waist: '26' },
        { size: 'S', bust: '34', waist: '28' },
        { size: 'M', bust: '36', waist: '30' },
        { size: 'L', bust: '38', waist: '32' },
        { size: 'XL', bust: '40', waist: '34' }
      ]
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${productToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
      // Show success message
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error deleting product. Please try again.';
      alert(`Error deleting product: ${errorMessage}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to delete.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const deletePromises = selectedProducts.map(productId =>
        axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      
      await Promise.all(deletePromises);
      await fetchProducts();
      setSelectedProducts([]);
      alert(`${selectedProducts.length} products deleted successfully!`);
    } catch (error) {
      console.error('Error deleting products:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error deleting products. Please try again.';
      alert(`Error deleting products: ${errorMessage}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product._id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'clothing',
      subcategory: '',
      brand: 'MONVI',
      stock: '',
      images: [],
      tags: [],
      isActive: true,
      isFeatured: false,
      discount: 0,
      material: '',
      pattern: '',
      color: '',
      occasion: '',
      sleeve_type: '',
      neck_type: '',
      fabric: '',
      wash_care: '',
      silhouette: '',
      length: '',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      size_guide: [
        { size: 'XS', bust: '32', waist: '26' },
        { size: 'S', bust: '34', waist: '28' },
        { size: 'M', bust: '36', waist: '30' },
        { size: 'L', bust: '38', waist: '32' },
        { size: 'XL', bust: '40', waist: '34' }
      ]
    });
  };

  const handleAddTag = () => {
    const newTag = prompt('Enter a new tag:');
    if (newTag && newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleAddSize = () => {
    const newSize = prompt('Enter a new size:');
    if (newSize && newSize.trim()) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }));
    }
  };

  const handleRemoveSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const updateSizeGuide = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      size_guide: prev.size_guide.map((guide, i) => 
        i === index ? { ...guide, [field]: value } : guide
      )
    }));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
          <p className="text-sm text-gray-500">Subcategories loaded: {subcategories.length}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchSubcategories}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
          >
            Refresh Subcategories
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FaPlus className="mr-2" size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedProducts.length} product(s) selected
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                disabled={deleteLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FaTrash size={14} />
                <span>Delete Selected</span>
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={product.images[0] || '/placeholder-product.png'}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price}
                    {product.discount > 0 && (
                      <span className="ml-2 text-xs text-green-600">
                        -{product.discount}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                      <button
                        type="button"
                        onClick={fetchSubcategories}
                        disabled={subcategoriesLoading}
                        className={`ml-2 text-xs underline ${
                          subcategoriesLoading 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-blue-600 hover:text-blue-800'
                        }`}
                        title="Refresh subcategories"
                      >
                        {subcategoriesLoading ? '(Refreshing...)' : '(Refresh)'}
                      </button>
                    </label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">
                        {subcategoriesLoading ? 'Loading subcategories...' : 'Select Subcategory'}
                      </option>
                      {(() => {
                        const filteredSubcategories = subcategories
                          .filter(sub => sub.category === formData.category && sub.isActive)
                          .sort((a, b) => a.sortOrder - b.sortOrder);
                        
                        console.log('Current category:', formData.category);
                        console.log('All subcategories:', subcategories);
                        console.log('Filtered subcategories for category:', filteredSubcategories);
                        
                        if (filteredSubcategories.length === 0) {
                          console.log('No subcategories found for category:', formData.category);
                          return (
                            <>
                              <option value="" disabled>No subcategories available</option>
                              {subcategories
                                .filter(sub => sub.category === formData.category)
                                .sort((a, b) => a.sortOrder - b.sortOrder)
                                .map(sub => (
                                  <option key={sub._id} value={sub.name}>
                                    {sub.name} {!sub.isActive && '(Inactive)'}
                                  </option>
                                ))}
                            </>
                          );
                        }
                        
                        return filteredSubcategories.map(sub => (
                          <option key={sub._id} value={sub.name}>
                            {sub.name}
                          </option>
                        ));
                      })()}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material
                    </label>
                    <select
                      value={formData.material}
                      onChange={(e) => setFormData({...formData, material: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Material</option>
                      {materials.map(material => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pattern
                    </label>
                    <select
                      value={formData.pattern}
                      onChange={(e) => setFormData({...formData, pattern: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Pattern</option>
                      {patterns.map(pattern => (
                        <option key={pattern} value={pattern}>{pattern}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Color</option>
                      {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Occasion</option>
                      {occasions.map(occasion => (
                        <option key={occasion} value={occasion}>{occasion}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sleeve Type
                    </label>
                    <select
                      value={formData.sleeve_type}
                      onChange={(e) => setFormData({...formData, sleeve_type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Sleeve Type</option>
                      {sleeveTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Neck Type
                    </label>
                    <select
                      value={formData.neck_type}
                      onChange={(e) => setFormData({...formData, neck_type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Neck Type</option>
                      {neckTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fabric
                    </label>
                    <select
                      value={formData.fabric}
                      onChange={(e) => setFormData({...formData, fabric: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Fabric</option>
                      {fabrics.map(fabric => (
                        <option key={fabric} value={fabric}>{fabric}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wash Care
                    </label>
                    <select
                      value={formData.wash_care}
                      onChange={(e) => setFormData({...formData, wash_care: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Wash Care</option>
                      {washCares.map(care => (
                        <option key={care} value={care}>{care}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Silhouette
                    </label>
                    <select
                      value={formData.silhouette}
                      onChange={(e) => setFormData({...formData, silhouette: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Silhouette</option>
                      {silhouettes.map(silhouette => (
                        <option key={silhouette} value={silhouette}>{silhouette}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length
                    </label>
                    <select
                      value={formData.length}
                      onChange={(e) => setFormData({...formData, length: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Length</option>
                      {lengths.map(length => (
                        <option key={length} value={length}>{length}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sizes and Size Guide */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Sizes & Size Guide</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Size
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size Guide
                  </label>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Bust</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Waist</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.size_guide.map((guide, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">
                              <input
                                type="text"
                                value={guide.size}
                                onChange={(e) => updateSizeGuide(index, 'size', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <input
                                type="text"
                                value={guide.bust}
                                onChange={(e) => updateSizeGuide(index, 'bust', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <input
                                type="text"
                                value={guide.waist}
                                onChange={(e) => updateSizeGuide(index, 'waist', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Images and Tags */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Images & Tags</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URLs (one per line)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Enter one URL per line. Empty lines will be ignored. URLs without protocol will automatically get https://
                  </p>
                  <textarea
                    rows="4"
                    value={formData.images.join('\n')}
                    onChange={(e) => {
                      const urls = e.target.value
                        .split('\n')
                        .map(url => url.trim())
                        .filter(url => url.length > 0)
                        .map(url => {
                          // Remove any extra whitespace and normalize
                          let cleanUrl = url.replace(/\s+/g, ' ').trim();
                          
                          // Ensure URL has proper protocol
                          if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
                            cleanUrl = `https://${cleanUrl}`;
                          }
                          
                          // Basic URL validation
                          try {
                            new URL(cleanUrl);
                            return cleanUrl;
                          } catch (error) {
                            console.warn('Invalid URL format:', cleanUrl);
                            return cleanUrl; // Still return it, let the image error handling deal with it
                          }
                        })
                        .filter(url => url && url.length > 0); // Final filter for any remaining empty strings
                      
                      console.log('Processing image URLs:', urls);
                      setFormData({...formData, images: urls});
                    }}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const testUrls = [
                          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
                          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500',
                          'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=500'
                        ];
                        setFormData({...formData, images: testUrls});
                      }}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Add Test Images
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const multiLineText = `https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500
                        
                        images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500
                        
                        http://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=500`;
                        setFormData({...formData, images: multiLineText.split('\n').map(url => url.trim()).filter(url => url.length > 0)});
                      }}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Test Multi-Line
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, images: []})}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Clear Images
                    </button>
                    {formData.images.length > 0 && (
                      <span className="text-sm text-gray-600">
                        ({formData.images.length} image{formData.images.length !== 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  {formData.images.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">
                        Preview ({formData.images.length} image{formData.images.length !== 1 ? 's' : ''}):
                      </p>
                      <div className="mb-2 text-xs text-gray-500">
                        {formData.images.map((url, index) => {
                          const isValid = url && (url.startsWith('http://') || url.startsWith('https://'));
                          return (
                            <div key={index} className={`mb-1 ${isValid ? 'text-green-600' : 'text-orange-600'}`}>
                              {index + 1}. {isValid ? '✓' : '⚠'} {url}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.images.map((url, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={url} 
                              alt={`Preview ${index + 1}`}
                              className="w-16 h-16 object-cover rounded border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div 
                              className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500"
                              style={{ display: 'none' }}
                            >
                              Error
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = formData.images.filter((_, i) => i !== index);
                                setFormData({...formData, images: newImages});
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <FaTrash className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this product? This action will permanently remove the product from your catalog.
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FaTrash size={14} />
                    <span>Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 