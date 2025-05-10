import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import logo from '../../assets/SERENITY.png';

function Header() {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add your logout logic here
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">  
                    <div className="d-flex align-items-center">
                        <img 
                            src={logo} 
                            alt="Serenity Logo" 
                            className="logo" 
                        />
                        <h1>SERENITY</h1>
                    </div>
                    <nav>
                        <div className="profile-dropdown">
                            <button 
                                className="profile-btn"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="profile-icon">
                                    <i className="bi bi-person-circle"></i>
                                </div>
                            </button>
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item">
                                        <i className="bi bi-person me-2"></i>
                                        Profile
                                    </Link>
                                    <button 
                                        onClick={handleLogout} 
                                        className="dropdown-item"
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header> 
    );
}

export default Header;