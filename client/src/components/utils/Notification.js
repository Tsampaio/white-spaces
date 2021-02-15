import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import styles from './Notification.module.css';

const Notification = () => {
  const [show, setShow] = useState(true);
  return (
    <div>
      <Toast onClose={() => setShow(false)} show={show} delay={50000} autohide className={styles.notificationCtn}>
        <Toast.Header className={styles.header}>
          <FaCheckCircle />
          <strong className="mr-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>You are registered, Please login</Toast.Body>
      </Toast>
    </div>
  );
};

export default Notification;
