#!/usr/bin/env python3
"""
MONVI E-commerce Backend API Testing Suite
Tests all backend APIs for the MONVI clothing store application.
"""

import requests
import json
import sys
from typing import Dict, List, Any
import time

# Backend URL from frontend/.env
BASE_URL = "https://e12c3b71-a077-4f2a-9d9d-5d1acbe23509.preview.emergentagent.com/api"

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_product_id = None
        self.created_cart_item_id = None
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def make_request(self, method: str, endpoint: str, **kwargs) -> requests.Response:
        """Make HTTP request with error handling"""
        url = f"{BASE_URL}{endpoint}"
        try:
            response = self.session.request(method, url, timeout=30, **kwargs)
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
            
    def test_api_root(self):
        """Test API root endpoint"""
        print("\n=== Testing API Root ===")
        response = self.make_request("GET", "/")
        
        if response and response.status_code == 200:
            data = response.json()
            if "message" in data and "MONVI API is running" in data["message"]:
                self.log_test("API Root", True, "API is running correctly")
            else:
                self.log_test("API Root", False, f"Unexpected response: {data}")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("API Root", False, f"Status code: {status_code}")
            
    def test_initialize_data(self):
        """Test sample data initialization"""
        print("\n=== Testing Sample Data Initialization ===")
        response = self.make_request("POST", "/initialize-data")
        
        if response and response.status_code == 200:
            data = response.json()
            if "message" in data and "initialized successfully" in data["message"]:
                self.log_test("Initialize Sample Data", True, "Sample data created successfully")
                time.sleep(2)  # Wait for data to be inserted
            else:
                self.log_test("Initialize Sample Data", False, f"Unexpected response: {data}")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("Initialize Sample Data", False, f"Status code: {status_code}")
            
    def test_categories_api(self):
        """Test categories endpoint"""
        print("\n=== Testing Categories API ===")
        response = self.make_request("GET", "/categories")
        
        if response and response.status_code == 200:
            data = response.json()
            if "dresses" in data and "sarees" in data:
                dress_categories = data["dresses"]
                saree_categories = data["sarees"]
                
                expected_dress_cats = ["cotton", "rayon", "organza", "georgette", "satin"]
                expected_saree_cats = ["cotton", "fancy", "banarasi", "silk", "georgette", "designer"]
                
                if all(cat in dress_categories for cat in expected_dress_cats) and \
                   all(cat in saree_categories for cat in expected_saree_cats):
                    self.log_test("Categories API", True, f"Found {len(dress_categories)} dress and {len(saree_categories)} saree categories")
                else:
                    self.log_test("Categories API", False, f"Missing expected categories. Got: {data}")
            else:
                self.log_test("Categories API", False, f"Missing dresses/sarees keys: {data}")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("Categories API", False, f"Status code: {status_code}")
            
    def test_products_api(self):
        """Test products endpoints"""
        print("\n=== Testing Products API ===")
        
        # Test GET all products
        response = self.make_request("GET", "/products")
        if response and response.status_code == 200:
            products = response.json()
            if isinstance(products, list) and len(products) > 0:
                self.log_test("GET All Products", True, f"Retrieved {len(products)} products")
                
                # Store first product ID for single product test
                first_product = products[0]
                product_id = first_product.get("id")
                
                # Validate product structure
                required_fields = ["id", "name", "price", "category", "subcategory", "images", "sizes"]
                if all(field in first_product for field in required_fields):
                    self.log_test("Product Structure Validation", True, "All required fields present")
                else:
                    missing = [f for f in required_fields if f not in first_product]
                    self.log_test("Product Structure Validation", False, f"Missing fields: {missing}")
                
                # Test GET single product
                if product_id:
                    single_response = self.make_request("GET", f"/products/{product_id}")
                    if single_response and single_response.status_code == 200:
                        single_product = single_response.json()
                        if single_product.get("id") == product_id:
                            self.log_test("GET Single Product", True, f"Retrieved product: {single_product.get('name')}")
                        else:
                            self.log_test("GET Single Product", False, "Product ID mismatch")
                    else:
                        status_code = single_response.status_code if single_response else "No response"
                        self.log_test("GET Single Product", False, f"Status code: {status_code}")
                
                # Test invalid product ID
                invalid_response = self.make_request("GET", "/products/invalid-id")
                if invalid_response and invalid_response.status_code == 404:
                    self.log_test("GET Invalid Product ID", True, "Correctly returned 404 for invalid ID")
                else:
                    status_code = invalid_response.status_code if invalid_response else "No response"
                    self.log_test("GET Invalid Product ID", False, f"Expected 404, got: {status_code}")
                    
            else:
                self.log_test("GET All Products", False, f"Expected list of products, got: {type(products)}")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("GET All Products", False, f"Status code: {status_code}")
            
    def test_products_filtering(self):
        """Test product filtering by category and subcategory"""
        print("\n=== Testing Product Filtering ===")
        
        # Test filter by category - dresses
        response = self.make_request("GET", "/products", params={"category": "dresses"})
        if response and response.status_code == 200:
            products = response.json()
            if all(p.get("category") == "dresses" for p in products):
                self.log_test("Filter by Category (dresses)", True, f"Found {len(products)} dress products")
            else:
                self.log_test("Filter by Category (dresses)", False, "Some products not in dresses category")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("Filter by Category (dresses)", False, f"Status code: {status_code}")
            
        # Test filter by category - sarees
        response = self.make_request("GET", "/products", params={"category": "sarees"})
        if response and response.status_code == 200:
            products = response.json()
            if all(p.get("category") == "sarees" for p in products):
                self.log_test("Filter by Category (sarees)", True, f"Found {len(products)} saree products")
            else:
                self.log_test("Filter by Category (sarees)", False, "Some products not in sarees category")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("Filter by Category (sarees)", False, f"Status code: {status_code}")
            
        # Test filter by subcategory
        response = self.make_request("GET", "/products", params={"subcategory": "cotton"})
        if response and response.status_code == 200:
            products = response.json()
            if all(p.get("subcategory") == "cotton" for p in products):
                self.log_test("Filter by Subcategory (cotton)", True, f"Found {len(products)} cotton products")
            else:
                self.log_test("Filter by Subcategory (cotton)", False, "Some products not in cotton subcategory")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("Filter by Subcategory (cotton)", False, f"Status code: {status_code}")
            
        # Test combined filtering
        response = self.make_request("GET", "/products", params={"category": "dresses", "subcategory": "cotton"})
        if response and response.status_code == 200:
            products = response.json()
            if all(p.get("category") == "dresses" and p.get("subcategory") == "cotton" for p in products):
                self.log_test("Combined Filter (dresses + cotton)", True, f"Found {len(products)} cotton dress products")
            else:
                self.log_test("Combined Filter (dresses + cotton)", False, "Filter combination failed")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("Combined Filter (dresses + cotton)", False, f"Status code: {status_code}")
            
    def test_create_product(self):
        """Test creating a new product"""
        print("\n=== Testing Product Creation ===")
        
        new_product = {
            "name": "Test Georgette Dress",
            "price": 1999.0,
            "original_price": 2499.0,
            "category": "dresses",
            "subcategory": "georgette",
            "material": "Georgette",
            "pattern": "Solid",
            "color": "Blue",
            "occasion": "Party",
            "sleeve_type": "Sleeveless",
            "neck_type": "Round",
            "length": "Knee Length",
            "fabric": "100% Georgette",
            "wash_care": "Dry clean only",
            "silhouette": "Bodycon",
            "images": ["https://example.com/test-image.jpg"],
            "sizes": ["S", "M", "L"],
            "size_guide": [
                {"size": "S", "bust": "34", "waist": "33"},
                {"size": "M", "bust": "36", "waist": "35"},
                {"size": "L", "bust": "38", "waist": "37"}
            ],
            "description": "Test product for API validation"
        }
        
        response = self.make_request("POST", "/products", json=new_product)
        if response and response.status_code == 200:
            created_product = response.json()
            if created_product.get("name") == new_product["name"]:
                self.created_product_id = created_product.get("id")
                self.log_test("Create Product", True, f"Created product with ID: {self.created_product_id}")
            else:
                self.log_test("Create Product", False, f"Product name mismatch: {created_product}")
        else:
            status_code = response.status_code if response else "No response"
            error_detail = ""
            if response:
                try:
                    error_detail = response.json()
                except:
                    error_detail = response.text
            self.log_test("Create Product", False, f"Status code: {status_code}, Error: {error_detail}")
            
    def test_cart_api(self):
        """Test cart management endpoints"""
        print("\n=== Testing Cart API ===")
        
        # First, get a product ID to add to cart
        products_response = self.make_request("GET", "/products")
        if not products_response or products_response.status_code != 200:
            self.log_test("Cart API Setup", False, "Could not retrieve products for cart testing")
            return
            
        products = products_response.json()
        if not products:
            self.log_test("Cart API Setup", False, "No products available for cart testing")
            return
            
        test_product = products[0]
        product_id = test_product.get("id")
        available_sizes = test_product.get("sizes", [])
        test_size = available_sizes[0] if available_sizes else "M"
        
        # Test GET empty cart
        response = self.make_request("GET", "/cart")
        if response and response.status_code == 200:
            cart_items = response.json()
            self.log_test("GET Cart", True, f"Retrieved cart with {len(cart_items)} items")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("GET Cart", False, f"Status code: {status_code}")
            
        # Test ADD to cart
        cart_item = {
            "product_id": product_id,
            "quantity": 2,
            "size": test_size
        }
        
        response = self.make_request("POST", "/cart", json=cart_item)
        if response and response.status_code == 200:
            added_item = response.json()
            if added_item.get("product_id") == product_id:
                self.created_cart_item_id = added_item.get("id")
                self.log_test("Add to Cart", True, f"Added item with ID: {self.created_cart_item_id}")
            else:
                self.log_test("Add to Cart", False, f"Product ID mismatch: {added_item}")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("Add to Cart", False, f"Status code: {status_code}")
            
        # Test ADD duplicate item (should update quantity)
        response = self.make_request("POST", "/cart", json=cart_item)
        if response and response.status_code == 200:
            updated_item = response.json()
            if updated_item.get("quantity") == 4:  # 2 + 2
                self.log_test("Add Duplicate Item", True, "Quantity updated correctly")
            else:
                self.log_test("Add Duplicate Item", False, f"Expected quantity 4, got: {updated_item.get('quantity')}")
        else:
            status_code = response.status_code if response else "No response"
            self.log_test("Add Duplicate Item", False, f"Status code: {status_code}")
            
        # Test UPDATE cart item
        if self.created_cart_item_id:
            response = self.make_request("PUT", f"/cart/{self.created_cart_item_id}", params={"quantity": 3})
            if response and response.status_code == 200:
                self.log_test("Update Cart Item", True, "Cart item quantity updated")
            else:
                status_code = response.status_code if response else "No response"
                self.log_test("Update Cart Item", False, f"Status code: {status_code}")
                
            # Test UPDATE invalid cart item
            response = self.make_request("PUT", "/cart/invalid-id", params={"quantity": 1})
            if response and response.status_code == 404:
                self.log_test("Update Invalid Cart Item", True, "Correctly returned 404 for invalid ID")
            else:
                status_code = response.status_code if response else "No response"
                self.log_test("Update Invalid Cart Item", False, f"Expected 404, got: {status_code}")
                
            # Test DELETE cart item
            response = self.make_request("DELETE", f"/cart/{self.created_cart_item_id}")
            if response and response.status_code == 200:
                self.log_test("Delete Cart Item", True, "Cart item deleted successfully")
            else:
                status_code = response.status_code if response else "No response"
                self.log_test("Delete Cart Item", False, f"Status code: {status_code}")
                
            # Test DELETE invalid cart item
            response = self.make_request("DELETE", "/cart/invalid-id")
            if response and response.status_code == 404:
                self.log_test("Delete Invalid Cart Item", True, "Correctly returned 404 for invalid ID")
            else:
                status_code = response.status_code if response else "No response"
                self.log_test("Delete Invalid Cart Item", False, f"Expected 404, got: {status_code}")
        else:
            self.log_test("Cart Item Operations", False, "No cart item ID available for testing")
            
    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting MONVI Backend API Tests")
        print(f"Testing against: {BASE_URL}")
        print("=" * 60)
        
        # Test in logical order
        self.test_api_root()
        self.test_initialize_data()
        self.test_categories_api()
        self.test_products_api()
        self.test_products_filtering()
        self.test_create_product()
        self.test_cart_api()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
                    
        return passed == total

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)