import React from 'react'
import footerLogo from '../../images/telmoacademy-logo1.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="footerSocialCtn">
            <img src={footerLogo} alt="Telmo Academy Logo"/>
            <span className="footerEmail"><i class="fas fa-envelope"></i>support[at]telmoacademy.com</span>
            <span className="footerSocial">
              <a href="#"><i class="fab fa-youtube"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
            </span>
          </div>

          <div className="footerLinks">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
            <a href="#">About</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
