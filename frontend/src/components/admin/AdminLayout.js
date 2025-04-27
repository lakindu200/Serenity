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
             Dashboard
          </Link>
          <Link to="/admin/product">
             Products
          </Link>
          <Link to="/admin/payments">
            Payment Management
          </Link>
          <Link to="/admin/warranty">
             Warranty Claims
          </Link>
          <Link to="/custom/customize" className="custom-order-link">
             Custom Orders
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