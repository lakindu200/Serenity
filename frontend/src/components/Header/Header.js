import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import { assets } from "../../assets/assets";

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
    };

    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-brand">
                    <div className="logo-container">
                        <button className="hamburger" >
                            {isDrawerOpen ? <FaTimes onClick={() => setIsDrawerOpen(!isDrawerOpen)} size={24} /> : <FaBars onClick={() => setIsDrawerOpen(!isDrawerOpen)} size={24} />}
                        </button>
                        <a href="/">
                            <img src={assets.serenity_Logo} alt="Serenity Logo" className="serenity-logo" />
                        </a>
                        <ul className={`nav-links ${isDrawerOpen ? "open" : ""}`}>
                            <li><a href="/" onClick={toggleDrawer}>Home</a></li>
                            <li><a href="/shop" onClick={toggleDrawer}>Shop</a></li>
                            <li><a href="/contact" onClick={toggleDrawer}>Contact Us</a></li>
                            <li><a href="/account" onClick={toggleDrawer}>My Account</a></li>
                        </ul>
                    </div>

                    <div className="cart">
                        <span>🛒 0 items - Rs.0.00</span>
                    </div>
                </div>
                {isDrawerOpen &&
                    <ul className={`nav-links ${isDrawerOpen ? "open" : ""}`}>
                        <li><a href="/" onClick={toggleDrawer}>Home</a></li>
                        <li><a href="/shop" onClick={toggleDrawer}>Shop</a></li>
                        <li><a href="/contact" onClick={toggleDrawer}>Contact Us</a></li>
                        <li><a href="/account" onClick={toggleDrawer}>My Account</a></li>
                    </ul>
                }
            </nav>
        </header>
    );
};

export default Header;