import React, { memo, useEffect } from 'react'
import ProfileSidebar from './ProfileSidebar';
import Profile from './Profile';
import ProfileBilling from './ProfileBilling';
import ProfileCourses from './ProfileCourses';
import SecondHeader from '../partials/SecondHeader';
import { useSelector } from 'react-redux';

const ProfileCtn = ({match, history}) => {
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
            <ProfileSidebar />
            { match.params.page === "courses" ? <ProfileCourses /> 
            : match.params.page === "billing" ? <ProfileBilling />
            : <Profile />}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(ProfileCtn);
