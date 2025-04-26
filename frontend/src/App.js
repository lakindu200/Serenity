import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';

// Warranty Components
import WarrantyForm from './components/warranty/WarrantyForm';
import TermsAndConditions from './components/warranty/TermsAndConditions';
import WarrantyClaims from './components/warranty/WarrantyClaims';

// Cart Components
import ProductView from './cartComponent/ProductView';
import CartView from './cartComponent/CartView';
import PaymentDetails from './cartComponent/PaymentDetails';
import PaymentDetailPage from './cartComponent/PaymentDetailPage';

// Product Components
import Product from "./pages/product/Add/product";
import DisplayProducts from "./pages/product/DisplayProduct/DisplayProduct";
import UpdateProduct from "./pages/product/Add/updateproduct";
import SingleProduct from "./pages/product/SingleProduct/SingleProduct";
import Shop from "./pages/Shop/Shop";
import Home from "./pages/Home/Home";

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="App">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/product" element={<AdminLayout><DisplayProducts /></AdminLayout>} />
          <Route path="/admin/product/add-product" element={<AdminLayout><Product /></AdminLayout>} />
          <Route path="/admin/product/:id" element={<AdminLayout><UpdateProduct /></AdminLayout>} />
          <Route path="/admin/payments" element={<AdminLayout><PaymentDetails /></AdminLayout>} />
          <Route path="/admin/warranty" element={<AdminLayout><WarrantyClaims /></AdminLayout>} />

          {/* Warranty Routes */}
          <Route path="/warranty" element={<WarrantyForm />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/warrantyclaims" element={<WarrantyClaims />} />

          {/* Cart Routes */}
          <Route path='/paymentdetails' element={<PaymentDetails />} />
          <Route path="/payment/:id" element={<PaymentDetailPage />} />
          <Route path="/cartview" element={<CartView />} />
          
          {/* Product Routes */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/admin/product/add-product" element={<Product />} />
          <Route path="/admin/product" element={<DisplayProducts />} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/product-view" element={<ProductView />} />
          
          {/* Home Route */}
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
