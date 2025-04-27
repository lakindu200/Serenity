import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddCustomProduct from './Add_custom_product';
import CustomOrder from '../adminSide/Custom_order';
import ClientOrder from '../adminSide/Client_order';
import Client_details from './Add_client_details';
import AddPrice from './Add_price';
import CustomPayment from './Custom_payment';
import CustomUpdate from '../adminSide/Custom_update';
import OrderDelete from '../adminSide/orderDelete';
import ClientDelete from '../adminSide/clientDelete';
import CustomHeader from './Header';

function CustomRoutes() {
  return (
    <div>
      <CustomHeader />
      <Routes>
        <Route path="/customize" element={<AddCustomProduct />} />
        <Route path="/orders" element={<CustomOrder />} /> 
        <Route path="/clients" element={<ClientOrder />} />
        <Route path="/client-details" element={<Client_details />} />
        <Route path="/add-price" element={<AddPrice />} />
        <Route path="/payment" element={<CustomPayment />} />
        <Route path="/update/:id" element={<CustomUpdate />} />
        <Route path="/order-delete/:id" element={<OrderDelete />} />
        <Route path="/client-delete/:id" element={<ClientDelete />} />
      </Routes>
    </div>
  );
}

export default CustomRoutes;