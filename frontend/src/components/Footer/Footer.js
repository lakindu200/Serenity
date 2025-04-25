import { assets } from "../../assets/assets";
import "./Footer.css";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaTwitter, 
  FaYoutube, 
  FaEnvelope 
} from 'react-icons/fa';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="promo-section">
                    <div className="promo-item">
                        <span className="promo-icon">💳</span>
                        <p>SRI LANKA'S BEST PRICE<br />We guarantee the best in the country</p>
                    </div>
                    <div className="promo-item">
                        <span className="promo-icon">🛡️</span>
                        <p>100% SECURE SHOPPING<br />Safe Payment & Delivery</p>
                    </div>
                </div>
                <div className="social-media">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF className="social-icon" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="social-icon" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn className="social-icon" />
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="social-icon" />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <FaYoutube className="social-icon" />
                    </a>
                    <a href="mailto:support@Serenityfurniture.com">
                        <FaEnvelope className="social-icon" />
                    </a>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-links">
                    <div className="footer-logo">
                        <img src={assets.serenity_Logo} alt="Serenity Logo" className="serenity-logo" />
                        <p>&copy; Serenity Furniture 2025</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;