import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

// Import Cart Components
import { CartProvider, useCart } from "./context/CartContext";
import CartModal from "./components/CartModal";

// Import Admin Components
import AdminLayout from "./components/Admin/AdminLayout";
import AdminLogin from "./components/Admin/AdminLogin";
import Dashboard from "./components/Admin/Dashboard";
import ProductManagement from "./components/Admin/ProductManagement";
import UserManagement from "./components/Admin/UserManagement";
import OrderManagement from "./components/Admin/OrderManagement";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;



// Header Component
const Header = ({ onCategorySelect, onSearchChange, onCartOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getCartCount } = useCart();

  const categories = {
    dresses: ["cotton", "rayon", "organza", "georgette", "satin"],
    sarees: ["cotton", "fancy", "banarasi", "silk", "georgette", "designer"]
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onCategorySelect(null)}>
            <img 
              src="/images/logos/Monvi_Styles_Brand_Identity_Design-removebg-preview (1).png" 
              alt="Monvi Styles" 
              className="h-12 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <h1 className="text-2xl font-bold text-gray-900 ml-2" style={{ display: 'none' }}>MONVI</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <div className="relative group">
              <button 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium"
                onClick={() => onCategorySelect("dresses")}
              >
                Dresses
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {categories.dresses.map((sub) => (
                  <button
                    key={sub}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                    onClick={() => onCategorySelect("dresses", sub)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative group">
              <button 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium"
                onClick={() => onCategorySelect("sarees")}
              >
                Sarees
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {categories.sarees.map((sub) => (
                  <button
                    key={sub}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                    onClick={() => onCategorySelect("sarees", sub)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
            <button 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium"
              onClick={() => onCategorySelect(null)}
            >
              Home
            </button>
          </nav>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button 
              onClick={onCartOpen}
              className="text-gray-700 hover:text-gray-900 relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
            <button className="text-gray-700 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-1">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div>
                <button 
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => onCategorySelect(null)}
                >
                  Home
                </button>
              </div>
              <div>
                <button 
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => onCategorySelect("dresses")}
                >
                  Dresses
                </button>
                <div className="ml-4 space-y-1">
                  {categories.dresses.map((sub) => (
                    <button
                      key={sub}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 capitalize"
                      onClick={() => onCategorySelect("dresses", sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <button 
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => onCategorySelect("sarees")}
                >
                  Sarees
                </button>
                <div className="ml-4 space-y-1">
                  {categories.sarees.map((sub) => (
                    <button
                      key={sub}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 capitalize"
                      onClick={() => onCategorySelect("sarees", sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Section Component
const HeroSection = ({ featuredProducts }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredProducts]);

  if (!featuredProducts.length) return null;

  return (
    <div className="relative h-96 md:h-[500px] bg-gradient-to-r from-pink-50 to-purple-50 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10">
          <img 
            src="/images/logos/Monvi_Styles_Brand_Identity_Design-removebg-preview (1).png" 
            alt="Monvi Styles" 
            className="h-24 md:h-32 w-auto mx-auto mb-6"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Discover MONVI
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Elegant ethnic wear for every occasion
          </p>
          <button className="bg-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-700 transition-colors">
            Shop Now
          </button>
        </div>
      </div>
      
      {/* Background Images */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={featuredProducts[currentSlide]?.images[0]} 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-pink-600' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent product detail from opening
    addToCart(product, selectedSize, 1);
    // Show success message
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={product.images && product.images[0] ? product.images[0] : '/images/placeholder.jpg'} 
          alt={product.name} 
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
        />
        <button className="absolute top-4 right-4 text-gray-400 hover:text-pink-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-center mb-2">
          <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
          {product.original_price && (
            <span className="ml-2 text-lg text-gray-500 line-through">₹{product.original_price}</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">Inclusive of all taxes</p>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <select 
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {product.sizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <button 
            className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Product Detail Component
const ProductDetail = ({ product, onBack }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, selectedSize, 1);
    // Show success message
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="mb-4">
            <img 
              src={product.images[currentImage]} 
              alt={product.name} 
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  index === currentImage ? 'border-pink-600' : 'border-gray-300'
                }`}
                onClick={() => setCurrentImage(index)}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            {product.original_price && (
              <span className="ml-3 text-xl text-gray-500 line-through">₹{product.original_price}</span>
            )}
          </div>
          <p className="text-gray-600 mb-4">Inclusive of all taxes</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Material:</strong> {product.material}</div>
              <div><strong>Pattern:</strong> {product.pattern}</div>
              <div><strong>Color:</strong> {product.color}</div>
              <div><strong>Occasion:</strong> {product.occasion}</div>
              {product.length && <div><strong>Length:</strong> {product.length}</div>}
              {product.sleeve_type && <div><strong>Sleeve:</strong> {product.sleeve_type}</div>}
              {product.neck_type && <div><strong>Neck:</strong> {product.neck_type}</div>}
              <div><strong>Fabric:</strong> {product.fabric}</div>
              <div><strong>Wash Care:</strong> {product.wash_care}</div>
              <div><strong>Silhouette:</strong> {product.silhouette}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Size Guide</h3>
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
                  {product.size_guide.map((size, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{size.size}</td>
                      <td className="border border-gray-300 px-4 py-2">{size.bust}</td>
                      <td className="border border-gray-300 px-4 py-2">{size.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Size</label>
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
            <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};



// Main App Component
const App = ({ onCartOpen }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'products', 'detail'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load products directly (skip initialize-data for now)
      const response = await axios.get(`${API}/products`);
      // Backend returns { success, data, count, pagination }
      const productsData = response.data.data || response.data;
      console.log('Products loaded:', productsData);
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      // Cart is now handled by CartContext
    } catch (error) {
      console.error('Error initializing app:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category, subcategory = null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    
    if (!category) {
      setCurrentView('home');
      setFilteredProducts(products);
    } else {
      setCurrentView('products');
      filterProducts(category, subcategory, searchTerm);
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    filterProducts(selectedCategory, selectedSubcategory, term);
  };

  const filterProducts = (category, subcategory, search) => {
    let filtered = products;
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (subcategory) {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }
    
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.material.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
  };



  const handleBackToProducts = () => {
    setCurrentView('products');
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MONVI...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>

        {/* Main App Routes */}
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50">
            <Header 
              onCategorySelect={handleCategorySelect}
              onSearchChange={handleSearchChange}
              onCartOpen={onCartOpen}
            />
            
            {currentView === 'home' && (
              <div>
                <HeroSection featuredProducts={products.slice(0, 4)} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
                  {products.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No products found. Please check the console for errors.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                          {products.slice(0, 8).map(product => (
                      <div key={product._id || product.id} onClick={() => handleProductClick(product)} className="cursor-pointer">
                        <ProductCard product={product} />
                      </div>
                    ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {currentView === 'products' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory ? 
                      `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} ${selectedSubcategory ? `- ${selectedSubcategory.charAt(0).toUpperCase() + selectedSubcategory.slice(1)}` : ''}` : 
                      'All Products'
                    } ({filteredProducts.length} items)
                  </h2>
                  <div className="flex items-center space-x-4">
                    <select className="border border-gray-300 rounded-lg px-4 py-2">
                      <option>Sort by</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest</option>
                      <option>Popular</option>
                    </select>
                    <button className="border border-gray-300 rounded-lg px-4 py-2">
                      Filter
                    </button>
                  </div>
                </div>
                
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No products found in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                      <div key={product._id || product.id} onClick={() => handleProductClick(product)} className="cursor-pointer">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {currentView === 'detail' && selectedProduct && (
              <ProductDetail 
                product={selectedProduct} 
                onBack={handleBackToProducts}
              />
            )}
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

// Wrapper component to handle cart modal
const AppWithCart = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div>
        <App onCartOpen={() => setIsCartOpen(true)} />
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
};

export default AppWithCart;