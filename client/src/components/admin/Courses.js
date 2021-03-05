import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Button } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { getCourses } from '../../actions/courses';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { saveFeaturedCoursesAction } from '../../actions/courses';
import './Courses.css';

const Courses = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { token } = auth;
  const courses = useSelector((state) => state.courses);
  const { coursesLoaded } = courses;

  const [courseState, setCourseSate] = useState([]);

  useEffect(() => {
    if(!coursesLoaded) {
      dispatch(getCourses());
    }
  }, [dispatch]);

  useEffect(() => {
    const sortedCourses = [...courses.all];

    sortedCourses.length > 0 &&
      sortedCourses.sort((a, b) => {
        return a.position - b.position;
      });

    setCourseSate(sortedCourses);
  }, [courses]);

  const images = require.context('../../../../uploads/courses/', true);

  const updateFeatureCourses = (i) => {
    console.log('Updating!!!');
    let copyFeature = [...courseState];

    console.log(copyFeature[i]);
    console.log(copyFeature[i].featured);
    copyFeature[i] = {
      ...copyFeature[i],
      featured: !copyFeature[i].featured,
    };

    console.log(copyFeature[i].featured);
    setCourseSate(copyFeature);
  };

  const allCourses = courseState.map((course, index) => {
    let img = '';
    try {
      img = images(`./${course.tag}.jpg`);
    } catch (error) {
      img = images(`./default-course.jpg`);
    }

    return (
      <Draggable
        draggableId={`draggable-${index}`}
        key={`draggable-${index}`}
        index={index}
      >
        {(provided) => (
          <Col
            md={4}
            xl={3}
            className="my-3"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
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
                <input
                  type="checkbox"
                  value={course.featured}
                  checked={course.featured ? 'checked' : false}
                  onChange={() => updateFeatureCourses(index)}
                />
                <span>Featured</span>
              </div>
            </div>
          </Col>
        )}
      </Draggable>
    );
  });

  // if (auth && auth.user && auth.user.role !== 'admin') {
  //   return <Redirect to="/" />;
  // }

  const handleOnDragEnd = (result) => {
    console.log(result);
    if (!result.destination) return;
    const items = Array.from(courseState);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    for (let i = 0; i < items.length; i++) {
      delete items[i].featuredPosition; 
      items[i].position = i;
    }
    setCourseSate(items);
  };

  const saveFeaturedCourses = (e) => {
    // const filteredData = data.filter((course) => {
    //   return course.featured;
    // })
    // e.preventDefault();
    // console.log(data);
    dispatch(saveFeaturedCoursesAction(courseState, token));
  };

  console.log(courseState);

  return (
    <>
      <div className="adminCtn">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* <div className="adminCourseTop"> */}
                <h1>Courses</h1>
                <div>
                  <Button variant="outline-primary" onClick={saveFeaturedCourses} className="mr-4">
                    Save Feature courses
                  </Button>
                  {/* {message ? <h3>{message}</h3> : null} */}
                  <Button>
                    <Link to="/admin/courses/create">New Course</Link>
                  </Button>
                </div>
              </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable
                    droppableId="coursesSequence"
                    direction="horizontal"
                    type="column"
                  >
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
              {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
