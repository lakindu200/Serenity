import React from "react";
import "./App.css";
import Product from "./components/Add product/product";
import { Routes, Route } from "react-router-dom";
import DisplayProducts from "./components/DisplayProduct";
import UpdateProduct from "./components/Add product/updateproduct"; // Ensure the correct path

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Routes>
          <Route path="/asd" element={<Product />} />
          <Route path="/lpl" element={<DisplayProducts />} />
          <Route path="/lpl/:id" element={<UpdateProduct />} /> {/* Use the component */}
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;