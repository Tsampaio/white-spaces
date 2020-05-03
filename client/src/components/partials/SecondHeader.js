import React from 'react';
import Navbar from './Navbar';
import './SecondHeader.css';

const SecondHeader = (props) => {
  return (
    <div className="secondHeader">
      <Navbar />
      <div className="overlay"></div>
     
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h1>{props.title}</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecondHeader;
