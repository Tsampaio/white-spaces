import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { getCourses } from '../../actions/courses';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Courses.css';

const Courses = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
	const courses = useSelector((state) => state.courses);
	
	const [courseState, setCourseSate] = useState([])

  useEffect(() => {
    dispatch(getCourses());
	}, [dispatch]);
	
	useEffect(() => {
		setCourseSate(courses.all)
	}, [courses])

  const images = require.context('../../../../uploads/courses/', true);

  const allCourses =
	courseState.map((course, index) => {
      let img = '';
      // if (course && course.hasThumbnail) {
      img = images(`./${course.tag}.jpg`);
      // } else {
      // 	img = images(`./default-course.jpg`);
      // }
			// console.log("THE ID IS");
			// console.log(typeof course._id);
      return (
        <Draggable draggableId={`draggable-${index}`} key={`draggable-${index}`} index={index}>
          {(provided) => (
            <Col md={4} xl={3} className="my-3" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
              <div className="cardBorder">
                <div className="courseThumbnail courseFeatured1">
                  <Link to={`/admin/courses/update/${course.tag}`}>
                    <img src={img.default} alt="javascript" />
                  </Link>
                </div>
                <div className="courseTitleCtn">
                  <Link to={`/admin/courses/update/${course.tag}`}>
                    {course.name}
                  </Link>
                </div>
                <div className="separator"></div>
                <div className="priceCtn">
                  {/* <span className="studentNumbers">
                    <i className="fas fa-user"></i> Telmo Sampaio
                  </span>
                  <span className="price">${course.price}</span> */}
									<input type="checkbox" />
									<span>Featured</span>
                </div>
              </div>
            </Col>
          )}
        </Draggable>
      );
    });

  if (auth && auth.user && auth.user.role !== 'admin') {
    return <Redirect to="/" />;
	}
	
	const handleOnDragEnd = (result) => {
		console.log(result)
		if(!result.destination) return
		const items = Array.from(courseState);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setCourseSate(items);
	}

	console.log(courseState)

  return (
    <>
      <div className="adminCtn">
        <div className="container-fluid">
          <div className="row">
            <div className="col-10">
              <div className="adminCourseTop">
                <h1>Admin</h1>
                <Link to="/admin/courses/create">New Course</Link>

                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="coursesSequence" direction="horizontal" type="column">
                    {(provided) => (
                      <div
                        className="row"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {allCourses}
												{provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
