import React from 'react';
import {Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import { RiMedal2Line } from 'react-icons/ri';
import { RiVipCrownFill, RiVipCrownLine, RiVipCrown2Fill } from 'react-icons/ri';
import { CgCrown } from 'react-icons/cg';
import { FaCrown } from 'react-icons/fa';


import './CourseCard.css';

const CourseCard = (props) => {
  const images = require.context('../../../../uploads/courses/', true);


  let img = images(`./${props.tag}.jpg`);

  return (
    <Col md={6} lg={3} className="offset-1 offset-md-0 my-4 col-10">
      <div className="cardBorder">
        <div className="courseThumbnail courseFeatured1">
          <Link className="courseTitle" to={`/courses/${props.tag}`}>
            <img src={img.default} alt="javascript" />
          </Link>
        </div>
        <div className="courseTitleCtn">
          <Link className="courseTitle" to={`/courses/${props.tag}`}>{props.name}</Link>
        </div>
        { props.price ? (
          <>
            <div className="separator"></div>
            <div className="priceCtn">
              
                <span className="studentNumbers">
                  { props.courseLevel === "beginner" ? 
                    ( <><RiVipCrownLine /> Beginner</> ) : props.courseLevel === "intermediate" ? 
                    ( <><RiVipCrownFill /> Intermediate</> ) : (<><FaCrown /> Advanced</>)
                  }
                </span>
                <span className="price">${props.price}</span>
            </div>
          </> ) : (
            <div className="courseProgressBorder">
              <div className="courseProgressCtn">
                <div style={{backgroundColor: "darkgrey", width: "0%", height: "100%"}}></div>
              </div>
              <p>0% Complete</p>
            </div>
          )}
      </div>
    </Col>
  )
}

export default CourseCard
