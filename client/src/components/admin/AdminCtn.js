import React, { memo, useEffect } from 'react'
import AdminSidebar from './AdminSidebar';
import Courses from './Courses';
import CourseCreate from './CourseCreate';
import CourseUpdate from './CourseUpdate';
import FeatureCourses from './FeatureCourses';
import SecondHeader from '../partials/SecondHeader';
import { useSelector } from 'react-redux';
import AllUsers from './AllUsers';

const AdminCtn = ({match, history}) => {
  console.log(match);

  const auth = useSelector(state => state.auth);
  const { active } = auth;

  useEffect(() => {
    if (active === 'notActive' && !auth.loading) {
      console.log("inside redirect");
      history.push("/activate");
    } else if (auth && !auth.isAuthenticated && !auth.loading) {
      history.push("/login");
    }
  }, [auth, active]);

  return (
    <>
      <SecondHeader />
      <div className="profileCtn">
        <div className="container-fluid">
          <div className="row">
            <AdminSidebar />
            { (match.params.page === "courses" && !match.params.subPage) ? <Courses /> : null }
            { match.params.page === "courses" ? (match.params.subPage === "create" ? <CourseCreate /> : null) : null }
            { match.params.page === "courses" ? (match.params.subPage === "update" ? <CourseUpdate /> : null) : null }
            { match.params.page === "featureCourses" ? <FeatureCourses /> : null }
            { match.params.page === "users" ? <AllUsers /> : null }
            
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(AdminCtn);
