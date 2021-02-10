import React from 'react';
import {Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RiMedal2Line } from 'react-icons/ri';
import './CourseCard.css';

const CourseCard = (props) => {
  const images = require.context('../../../../uploads/courses/', true);


  let img = images(`./${props.tag}.jpg`);

  return (
    <Col md={3} className="offset-1 offset-md-0 my-4 col-10">
      <div className="cardBorder">
        <div className="courseThumbnail courseFeatured1">
          <Link className="courseTitle" to={`/courses/${props.tag}`}>
            <img src={img.default} alt="javascript" />
          </Link>
        </div>
        <div className="courseTitleCtn">
          <Link className="courseTitle" to={`/courses/${props.tag}`}>{props.name}</Link>
        </div>
        <div className="separator"></div>
        <div className="priceCtn">
          <span className="studentNumbers"><RiMedal2Line/> Advanced</span><span className="price">${props.price}</span>
        </div>
      </div>
    </Col>
  )
}

export default CourseCard
