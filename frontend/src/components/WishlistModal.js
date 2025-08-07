import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import Checkout from './Checkout';

const WishlistModal = ({ isOpen, onClose, onProductClick }) => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  // Show checkout if requested
  if (showCheckout) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Checkout from Wishlist</h2>
            <button
              onClick={() => setShowCheckout(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <Checkout items={items} source="wishlist" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-600">Your wishlist is empty</p>
            <p className="text-sm text-gray-500 mt-2">Add some products to your wishlist to see them here</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
                             {items.map((item) => (
                 <div key={item.product._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                   <img
                     src={item.product.images && item.product.images[0] ? item.product.images[0] : '/images/placeholder.jpg'}
                     alt={item.product.name}
                     className="w-20 h-20 object-cover rounded-lg"
                     onError={(e) => {
                       e.target.src = '/images/placeholder.jpg';
                     }}
                   />
                   <div 
                     className="flex-1 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                     onClick={() => {
                       if (onProductClick) {
                         onProductClick(item.product);
                         onClose(); // Close wishlist modal after navigation
                       }
                     }}
                   >
                     <h3 className="font-semibold text-gray-900 hover:text-pink-600">{item.product.name}</h3>
                     <p className="text-gray-600 text-sm">{item.product.material}</p>
                     <p className="text-lg font-bold text-gray-900">₹{item.product.price}</p>
                   </div>
                  <button
                    onClick={() => removeFromWishlist(item.product._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Remove from wishlist"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear Wishlist
              </button>
              <div className="text-sm text-gray-600">
                {items.length} item{items.length !== 1 ? 's' : ''} in wishlist
              </div>
            </div>
            
            {/* Checkout Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Checkout All Items
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistModal; 