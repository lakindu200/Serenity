import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaWarehouse, FaFileInvoiceDollar, FaShieldAlt } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-item">
            <FaWarehouse /> Dashboard
          </Link>
          <Link to="/admin/product" className="admin-nav-item">
            <FaBox /> Products
          </Link>
          <Link to="/admin/payments" className="admin-nav-item">
            <FaFileInvoiceDollar /> Payments
          </Link>
          <Link to="/admin/warranty" className="admin-nav-item">
            <FaShieldAlt /> Warranty Claims
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