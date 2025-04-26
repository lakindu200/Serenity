import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import WarrantyForm from './components/warranty/WarrantyForm';
import TermsAndConditions from './components/warranty/TermsAndConditions';
import WarrantyClaims from './components/warranty/WarrantyClaims';
import React from "react";
import { Routes, Route } from 'react-router-dom';
import "./App.css";

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

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
       
        
        <div>
        {Array.from({ length: 5 }).map((_, index) => (
          <br key={index} />
        ))}
      </div>
      
        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Container>
            <Routes>
              <Route path="/" element={<WarrantyForm />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/warrantyclaims" element={<WarrantyClaims />} />
            </Routes>
          </Container>
        </Box>
        <div>

        {Array.from({ length: 5 }).map((_, index) => (
          <br key={index} />
        ))}
      </div>
      
        
        
      </div>
    </Router>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="App">
        <Routes>
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
          
          {/* Home Routes */}
          <Route path="/product-view" element={<ProductView />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
