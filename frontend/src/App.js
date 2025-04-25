import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Admin routes
import Product from "./pages/product/Add/product";
import DisplayProducts from "./pages/product/DisplayProduct/DisplayProduct";
import UpdateProduct from "./pages/product/Add/updateproduct";
import SingleProduct from "./pages/product/SingleProduct/SingleProduct";
import Shop from "./pages/Shop/Shop";
import Home from "./pages/Home/Home";

// Cart routes
import CartView from './cartComponent/CartView';
import PaymentDetails from './cartComponent/PaymentDetails';
import PaymentDetailPage from './cartComponent/PaymentDetailPage';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        
        {/* Admin routes */}
        <Route path="/admin/product/add-product" element={<Product />} />
        <Route path="/admin/product" element={<DisplayProducts />} />
        <Route path="/admin/product/:id" element={<UpdateProduct />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        
        {/* Cart routes */}
        <Route path="/cartview" element={<CartView />} />
        <Route path="/paymentdetails" element={<PaymentDetails />} />
        <Route path="/payment/:id" element={<PaymentDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
