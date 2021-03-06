import React, {useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './CookiePolicy.module.css';

const CookiePolicy = () => {

  const [policy, setPolicy] = useState();

  useEffect(() => {
    const data = localStorage.getItem('cookiePolicy');
    setPolicy(data)
  }, [])

  const acceptCookie = () => {
    localStorage.setItem('cookiePolicy', true);
    setPolicy(true)
  }
  
  const showPolicy = () => {
    if(!policy) {
      return <div className={styles.container}>
      <p>
        By clicking "Accept Cookies", you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and improve marketing. <Link to="/privacy">Learn more</Link>
      </p>
      <Button onClick={acceptCookie}>Accept Cookies</Button>
      </div>
    } else {
      return null
    }
  }


  return (
    showPolicy()
  )
}

export default CookiePolicy
