import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import logo from '../assets/SERENITY.png'; // Update path based on your logo location

function Header() {
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
                        <ul className="nav">
                            <li className="nav-item">
                                <a className="crt_button" href="#home">
                                    CART
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header> 
    );
}

export default Header;