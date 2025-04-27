import React from 'react';
import { Link } from 'react-router-dom';
import { FaTshirt, FaUsers, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import './CustomLayout.css';

const CustomLayout = ({ children }) => {
  return (
    <div className="custom-layout">
      <div className="custom-sidebar">
        <nav className="custom-nav">
          <Link to="/custom/customize" className="nav-link">
            <FaTshirt /> Add Custom Product
          </Link>
          <Link to="/custom/orders" className="nav-link">
            <FaClipboardList /> Orders List
          </Link>
          <Link to="/custom/clients" className="nav-link">
            <FaUsers /> Client List
          </Link>
        </nav>
      </div>
      <div className="custom-content">
        {children}
      </div>
    </div>
  );
};

export default CustomLayout;