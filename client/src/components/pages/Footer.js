import React from 'react'
import footerLogo from '../../images/telmoacademy-logo1.png';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row className={styles.footerSocialCtn}>
          <div className={styles.footerLogoSocialCtn}>
            <img src={footerLogo} alt="Telmo Academy Logo"/>
            {/* <span className="footerEmail"><i className="fas fa-envelope"></i>support@telmoacademy.com</span> */}
            <span className={styles.footerSocial}>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </span>
          </div>

          <div className={styles.footerLinks}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
            <a href="#">About</a>
          </div>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
