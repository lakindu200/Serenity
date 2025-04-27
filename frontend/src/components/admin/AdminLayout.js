import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaWarehouse, FaFileInvoiceDollar, FaShieldAlt, FaTshirt } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <nav className="admin-nav">
          <Link to="/admin/dashboard">
            <FaWarehouse /> Dashboard
          </Link>
          <Link to="/admin/product">
            <FaBox /> Products
          </Link>
          <Link to="/admin/payments">
            <FaFileInvoiceDollar /> Payment Management
          </Link>
          <Link to="/admin/warranty">
            <FaShieldAlt /> Warranty Claims
          </Link>
          <Link to="/custom/customize" className="custom-order-link">
            <FaTshirt /> Custom Orders
          </Link>
        </nav>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;