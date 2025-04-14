import React from 'react';
import './App.css';
import Header from './components/Header';
import AddCustomProduct from './components/Add_custom_product';
import Home from './components/Home';
import Client_details from './components/Add_client_details';
import CustomOrder from './components/adminSide/Custom_order';
import ClientOrder from './components/adminSide/Client_order';
import CustomUpdate from './components/adminSide/Custom_update';
import CustomPayment from './components/Custom_payment';
import AddPrice from './components/Add_price';
import OrderDelete from './components/adminSide/orderDelete';
import ClientDelete from './components/adminSide/clientDelete';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Router> 
      <div className="App">
        <Header />
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="navbar-nav mx-auto"> 
              <div className="buttons"> 
                <Link to="/" className="button">PRODUCTS</Link>
                <Link to="/customize" className="button">CUSTOMIZE</Link>
                <Link to="/orders" className="button">ORDERS</Link>
                <Link to="/client" className="button">CLIENTS</Link>
              </div>
            </div>
          </div>
          <div>
            
          </div>
        </nav>
        <main className="container mt-4">
          <Routes>
            <Route path="/customize" element={<AddCustomProduct />} />
            <Route path="/orders" element={<CustomOrder />} /> 
            <Route path="/client" element={<ClientOrder />} />
            <Route path="/client_details" element={<Client_details />} />
            <Route path="/add-price" element={<AddPrice />} />
            <Route path="/payment" element={<CustomPayment />} />
            <Route path="/update-product/:id" element={<CustomUpdate />} />
            <Route path="/order-delete/:id" element={<OrderDelete />} />
            <Route path="/client-delete/:id" element={<ClientDelete />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
