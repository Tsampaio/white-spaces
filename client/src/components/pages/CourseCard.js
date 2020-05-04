import React from 'react'
import './CourseCard.css';

const CourseCard = () => {
  return (
    <div className="col-3">
      <div className="cardBorder">
        <div className="courseThumbnail courseFeatured1">
          <a href="/courses"></a>
        </div>
        <div className="courseTitleCtn">
          <a href="/courses" className="courseTitle">Responsive Website</a>
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
