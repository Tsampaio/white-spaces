import React from 'react'
import footerLogo from '../../images/telmoacademy-logo1.png';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row className={styles.footerSocialCtn}>
          <div className={styles.footerLogoSocialCtn}>
            <Link to="/">
              <img src={footerLogo} alt="Telmo Academy Logo"/>
            </Link>
            {/* <span className="footerEmail"><i className="fas fa-envelope"></i>support@telmoacademy.com</span> */}
            <span className={styles.footerSocial}>
              <a href="https://www.youtube.com/user/Telmo87/" rel="noreferrer" target="_blank"><i className="fab fa-youtube"></i></a>
              <a href="https://twitter.com/DevTelmo" rel="noreferrer" target="_blank"><i className="fab fa-twitter"></i></a>
              <a href="https://www.instagram.com/sampaiotravels" rel="noreferrer" target="_blank"><i className="fab fa-instagram"></i></a>
            </span>
          </div>

          <div className={styles.footerLinks}>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            {/* <a href="#">Blog</a> */}
            <a href="#">Contact</a>
            <a href="#">About</a>
          </div>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
