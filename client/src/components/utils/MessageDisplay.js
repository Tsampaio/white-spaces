import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import styles from './MessageDisplay.module.css'

const MessageDisplay = ({header, status, message}) => {
  return (
    <div className={styles.messageCtn}>
      <div className={styles.messageHeader}>
        {status === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
        <strong className="mr-auto">{header}</strong>
      </div>
      <p className={styles.messageBody}>{message}</p>
    </div>
  );
};

export default MessageDisplay;
