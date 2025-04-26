import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import axios from 'axios';
import "./Header.css";
import { assets } from "../../assets/assets";

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/cart/getAll');
                setCartCount(response.data.length);
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        };

        fetchCartCount();
    }, []);

    const toggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
    };

    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-brand">
                    <div className="logo-container">
                        <button className="hamburger">
                            {isDrawerOpen ? 
                                <FaTimes onClick={toggleDrawer} size={24} /> : 
                                <FaBars onClick={toggleDrawer} size={24} />
                            }
                        </button>
                        <Link to="/">
                            <img src={assets.serenity_Logo} alt="Serenity Logo" className="serenity-logo" />
                        </Link>
                        <ul className={`nav-links ${isDrawerOpen ? "open" : ""}`}>
                            <li><Link to="/" onClick={toggleDrawer}>Home</Link></li>
                            <li><Link to="/shop" onClick={toggleDrawer}>Shop</Link></li>
                            <li><Link to="/warranty" onClick={toggleDrawer}>Warranty Claim</Link></li>
                        </ul>
                    </div>

                    <div className="nav-actions">
                        <Link to="/account" className="nav-button">
                            
                            <span>My Account</span>
                        </Link>
                        <Link to="/cartview" className="nav-button cart-button">
                            <FaShoppingCart size={20} />
                            <span>Cart</span>
                            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                        </Link>
                    </div>
                </div>
                {isDrawerOpen && (
                    <ul className={`nav-links ${isDrawerOpen ? "open" : ""}`}>
                        <li><Link to="/" onClick={toggleDrawer}>Home</Link></li>
                        <li><Link to="/shop" onClick={toggleDrawer}>Shop</Link></li>
                        <li><Link to="/warranty" onClick={toggleDrawer}>Warranty</Link></li>
                        <li><Link to="/cartview" onClick={toggleDrawer}>Cart</Link></li>
                        <li><Link to="/contact" onClick={toggleDrawer}>Contact Us</Link></li>
                        <li><Link to="/account" onClick={toggleDrawer}>My Account</Link></li>
                    </ul>
                )}
            </nav>
        </header>
    );
};

export default Header;