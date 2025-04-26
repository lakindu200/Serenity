import React from "react";
import "./App.css";
import Product from "./pages/product/Add/product";
import { Routes, Route } from "react-router-dom";
import DisplayProducts from "./pages/product/DisplayProduct/DisplayProduct";
import UpdateProduct from "./pages/product/Add/updateproduct";
import SingleProduct from "./pages/product/SingleProduct/SingleProduct";
import Shop from "./pages/Shop/Shop";
import Home from "./pages/Home/Home";

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/admin/product/add-product" element={<Product />} />
          <Route path="/admin/product" element={<DisplayProducts />} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
          <Route path="/product/:id" element={<SingleProduct />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;     