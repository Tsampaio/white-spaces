import React from 'react';
// import jsCart from '../../images/javascript-shopping.jpg';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = (props) => {
  const images = require.context('../../images/courses', true);


  let img = images(`./${props.tag}.jpg`);

  return (
    <div className="col-3">
      <div className="cardBorder">
        <div className="courseThumbnail courseFeatured1">
          <Link className="courseTitle" to={`/courses/${props.tag}`}>
            <img src={img} alt="javascript" />
          </Link>
        </div>
        <div className="courseTitleCtn">
          <Link className="courseTitle" to={`/courses/${props.tag}`}>{props.name}</Link>
        </div>
        <div className="separator"></div>
        <div className="priceCtn">
          <span className="studentNumbers"><i className="fas fa-users"></i>860</span><span className="price">${props.price}</span>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
