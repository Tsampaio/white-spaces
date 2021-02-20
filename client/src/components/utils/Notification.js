import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from './Notification.module.css';

const Notification = ({status, message, hideCloseBtn}) => {
  const [show, setShow] = useState(true);
  const [toggleCard, setToggleCard] = useState(false)

  useEffect(() => {

    if(toggleCard) {
      setShow(true)
    }
  }, [toggleCard])
  useEffect(() => {
    console.log("inside useEffect")
    return () => {
      setToggleCard(true)
      console.log("Cleaning up")
    }
  }, [show])

  const hideCard = () => {
    setShow(false)
  }

  console.log("My toggleCard is" + toggleCard);
  return (
    <div>
      <Toast onClose={() => hideCard()} show={show} delay={50000} autohide className={styles.notificationCtn}>
        <Toast.Header className={styles.header}>
          { status === "success" ? (
            <>
              <FaCheckCircle />
              <strong className="mr-auto">Success</strong>
            </>
          ) : (
            <>
              <FaTimesCircle />
              <strong className="mr-auto">Error</strong>
            </>
          )}
          
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </div>
  );
};

export default Notification;
