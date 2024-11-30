import React from 'react';
import logo from '../images/logo.jpg';
import logo_social from '../images/6.jpg';

const Footer = () => {
  return (
    <footer>
      <div className="footer_top">
        <div className="branding">
          <h2>Магаз шкар</h2>
          <p>Краща обувка вашого життя</p>
        </div>
        <img className="footer_img" src={logo} alt="Logo" />
        <div className="social-icons">
          <a href="#"><img src={logo_social} alt="Facebook" /></a>
          <a href="#"><img src={logo_social} alt="Twitter" /></a>
          <a href="#"><img src={logo_social} alt="LinkedIn" /></a>
          <a href="#"><img src={logo_social} alt="Google" /></a>
        </div>
      </div>
      <p>&copy; 2024 IoT</p>
    </footer>
  );
};

export default Footer;