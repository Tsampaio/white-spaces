import React from 'react';
import jsCart from '../../images/javascript-shopping.jpg';
import './CourseCard.css';

const CourseCard = () => {
  return (
    <div className="col-3">
      <div className="cardBorder">
        <div className="courseThumbnail courseFeatured1">
          <a href="/courses/js">
            <img src={jsCart} alt="javascript" />
          </a>
        </div>
        <div className="courseTitleCtn">
          <a href="/courses/js" className="courseTitle">Responsive Website</a>
        </div>
        <div className="separator"></div>
        <div className="priceCtn">
          <span className="studentNumbers"><i className="fas fa-users"></i>860</span><span className="price">$32.90</span>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
