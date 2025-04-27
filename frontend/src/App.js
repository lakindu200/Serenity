import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

// Main Components
import Shop from "./pages/Shop/Shop";
import Home from "./pages/Home/Home";

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';

// Product Components
import Product from "./pages/product/Add/product";
import DisplayProducts from "./pages/product/DisplayProduct/DisplayProduct";
import UpdateProduct from "./pages/product/Add/updateproduct";
import SingleProduct from "./pages/product/SingleProduct/SingleProduct";

// Cart Components
import ProductView from './cartComponent/ProductView';
import CartView from './cartComponent/CartView';
import PaymentDetails from './cartComponent/PaymentDetails';
import PaymentDetailPage from './cartComponent/PaymentDetailPage';

// Warranty Components
import WarrantyForm from './components/warranty/WarrantyForm';
import TermsAndConditions from './components/warranty/TermsAndConditions';
import WarrantyClaims from './components/warranty/WarrantyClaims';

// Custom Order Components 
import AddCustomProduct from './components/customorder/Add_custom_product';
import CustomOrder from './components/adminSide/Custom_order';
import ClientOrder from './components/adminSide/Client_order';
import Client_details from './components/customorder/Add_client_details';
import AddPrice from './components/customorder/Add_price';
import CustomPayment from './components/customorder/Custom_payment';
import CustomUpdate from './components/adminSide/Custom_update';
import OrderDelete from './components/adminSide/orderDelete';
import ClientDelete from './components/adminSide/clientDelete';

import MainLayout from './layouts/MainLayout';
import CustomLayout from './components/customorder/CustomLayout';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="product" element={<DisplayProducts />} />
              <Route path="product/add-product" element={<Product />} />
              <Route path="product/:id" element={<UpdateProduct />} />
              {/* Add payment management routes to admin panel */}
              <Route path="payments" element={<PaymentDetails />} />
              <Route path="payment/:id" element={<PaymentDetailPage />} />
              <Route path="warranty" element={<WarrantyClaims />} />
            </Routes>
          </AdminLayout>
        } />

        {/* Custom Order Routes */}
        <Route path="/custom/*" element={
          <CustomLayout>
            <Routes>
              <Route path="customize" element={<AddCustomProduct />} />
              <Route path="orders" element={<CustomOrder />} />
              <Route path="clients" element={<ClientOrder />} />
              <Route path="client-details" element={<Client_details />} />
              <Route path="add-price" element={<AddPrice />} />
              <Route path="payment" element={<CustomPayment />} />
              <Route path="update/:id" element={<CustomUpdate />} />
              <Route path="delete/:id" element={<OrderDelete />} /> {/* Simplified path */}
              <Route path="client/delete/:id" element={<ClientDelete />} />
            </Routes>
          </CustomLayout>
        } />

        {/* Main Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          
          {/* Cart Routes - Keep only cart and checkout */}
          <Route path="cart" element={<CartView />} />
          <Route path="cartview" element={<CartView />} />
          
          {/* Shop Routes */}
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<SingleProduct />} />
          <Route path="product-view" element={<ProductView />} />
          
          {/* Warranty Routes */}
          <Route path="warranty" element={<WarrantyForm />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="warranty-claims" element={<WarrantyClaims />} />
          
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
