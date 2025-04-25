import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import { assets } from "../../assets/assets";

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/cart/getAll');
            setCartItems(response.data);
            calculateTotal(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
    };

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
                            <li><Link to="/contact" onClick={toggleDrawer}>Contact Us</Link></li>
                            <li><Link to="/account" onClick={toggleDrawer}>My Account</Link></li>
                        </ul>
                    </div>

                    <div className="cart">
                        <span>🛒 {cartItems.length} items - Rs.{cartTotal.toFixed(2)}</span>
                        <Link to="/cartview" className="cart-button">View Cart</Link>
                    </div>
                </div>
                {isDrawerOpen && (
                    <ul className={`nav-links ${isDrawerOpen ? "open" : ""}`}>
                        <li><Link to="/" onClick={toggleDrawer}>Home</Link></li>
                        <li><Link to="/shop" onClick={toggleDrawer}>Shop</Link></li>
                        <li><Link to="/contact" onClick={toggleDrawer}>Contact Us</Link></li>
                        <li><Link to="/account" onClick={toggleDrawer}>My Account</Link></li>
                    </ul>
                )}
            </nav>
        </header>
    );
};

export default Header;