import React, {memo} from 'react'
import ProfileSidebar from './ProfileSidebar';
import Profile from './Profile';
import ProfileBilling from './ProfileBilling';
import ProfileCourses from './ProfileCourses';
import SecondHeader from '../partials/SecondHeader';

const ProfileCtn = ({match}) => {
  console.log(match);
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
