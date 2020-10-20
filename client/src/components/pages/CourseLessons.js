import React, { Fragment, useEffect, useState } from 'react';
import SecondHeader from '../partials/SecondHeader';
import './CourseLesson.css';
import store from '../../store';
import { useParams, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCourse, getCoursesOwned, finishLessonAction, lessonsWatchedAction } from '../../actions/courses';

const CourseLessons = ({ 
	course, 
	auth, 
	getCoursesOwned, 
	getCourse, 
	finishLessonAction, 
	lessonsWatchedAction }) => {

	const [page, setPage] = useState({
		loaded: false
	});

	const [mobileMenu, setMobileMenu] = useState({
		open: false
	});

	let { courseTag, lesson } = useParams();

	lesson = parseInt(lesson);

	useEffect(() => {
		let isSubscribed = true;
		if (isSubscribed) {
			setPage({ loaded: true });
			getCourse(courseTag);
		}

		return () => (isSubscribed = false);
	}, []);

	useEffect(() => {
		let isSubscribed = true;
		if (isSubscribed) {
			
			setCoursesOwned();
		}

		return () => (isSubscribed = false);
	}, [auth && auth.user && auth.user._id]);

	useEffect(() => {
		let isSubscribed = true;
		if (isSubscribed) {
			redirectUser();
		}
		return () => (isSubscribed = false);
	}, [auth.coursesOwned])


	useEffect(() => {
		lessonsWatchedAction(courseTag, auth.token);
	}, [auth && auth.token])
	// useEffect(() => {
	// 	console.log("calling redirect user")
	// 	if ( (page.loaded && auth && auth.user && auth.user.role !== "admin" && !checkCourseAccess) || (auth && auth.membership && auth.membership.active)) {
	// 		redirectUser();
	// 	}
	// }, [page.loaded, auth.membership, auth.user]);

	const setCoursesOwned = async () => {
		await getCoursesOwned(auth && auth.user && auth.user._id);

	}

	const totalLessons = course && course.data && course.data.classes && course.data.classes.length;
	// console.log(totalLessons);

	// console.log(course);
	// console.log(lesson)

	const checkLesson = (theClass, i) => {
		// console.log("INSIDE Checking Lesson");
		// console.log(theClass.watched)
		for (let y = 0; y <= theClass.watched.length; y++) {
			// console.log("Are there classes");
			// console.log(theClass.watched.length > 0)
			if (theClass.watched.length > 0 && JSON.stringify(theClass.watched[y].user) === JSON.stringify(auth && auth.user && auth.user._id)) {
				// console.log("We found a CLASS");
				return theClass.watched[y].complete ?
					<i className="fas fa-check-circle complete"></i>
					: <i className="far fa-circle"></i>
			} else {
				return <i className="far fa-circle"></i>
			}

		}
	}

	let classes = course && course.data && course.data.classes && course.data.classes.map((theClass, i) => {
		return (
			<div className="lesson" key={i}>
				<div className="lessonComplete" onClick={() => finishLessonAction(i, course && course.data && course.data._id, auth && auth.token)}>
					{/* {	theClass.watched.complete ? 
						<i className="fas fa-check-circle complete"></i>
					 : <i className="far fa-circle"></i>
					}  */}
					{console.log("CHECKING LESSON")}
					{checkLesson(theClass, i)}


				</div>
				<Link className={lesson === (i + 1) ? "lessonLink lessonActive" : "lessonLink"} to={`/courses/${course.data.tag}/lessons/${theClass.lecture}`}>
					{/* <i className="fas fa-play-circle"></i> */}
					<p>{theClass.title} <span className="lessonTime"> - ({theClass.duration} mins)</span></p>
				</Link>
			</div>
		);
	});

	const lessonContinue = () => {
		if ((lesson + 1) > totalLessons) {
			// console.log(lesson);
			// console.log("inside of if");
			return <h1>Last Lesson of the Course!</h1>
		} else {
			// console.log("inside of else");
			return <Link to={`/courses/${course && course.data && course.data.tag}/lessons/${lesson + 1}`}><h1>Next Lesson <i className="fas fa-arrow-right"></i></h1></Link>
		}
	}

	const checkCourseAccess = auth && auth.coursesOwned.length > 0 && auth.coursesOwned.find((theCourse) => {
		return theCourse.tag === courseTag
	});

	// console.log(checkCourseAccess);

	const percentageWatched = () => {
		if (course && course.data && course.data.classes) {
			const totalLessons = course && course.data && course.data.classes.length;

			let totalLessonsWatched = 0;

			for (let i = 0; i < course.data.classes.length; i++) {
				//  console.log(course.data.classes[i]);
				if (course.data.classes[i].watched[0].complete) {
					totalLessonsWatched += 1;
				}
			}

			return (totalLessonsWatched * 100 / totalLessons).toFixed(0);
		}
	}

	const openMobileMenu = () => {
		setMobileMenu({
			open: !mobileMenu.open
		})
	}

	const redirectUser = () => {
		if (auth && auth.user && auth.user.role !== "admin" && !checkCourseAccess && !auth.membership.active && page.loaded) {
			return <Redirect to="/courses" />
		}
	}

	return (
		<Fragment>
			<SecondHeader />
			<div className="container-fluid courseLesson">
				<div className="row">
					<div className={mobileMenu.open ? 'courseLinksCtn active' : 'courseLinksCtn'}>
						<h1 onClick={openMobileMenu}><i class="far fa-play-circle"></i><span>{course && course.data && course.data.name}</span></h1>

						<h5 className="courseCurriculum">{percentageWatched()}% <span>complete</span></h5>
						<div className="lessonsCtn">
							{classes}
						</div>
					</div>
					<div className="courseLinksCtn backup">

					</div>
					<div className="courseMainVideoCtn">
						{lessonContinue()}
						<div className="currentLessonTitle">
							<i class="fas fa-chalkboard-teacher"></i>
							<p>{course && course.data && course.data.classes && course.data.classes[lesson - 1].title}</p>
						</div>

						<div className="videoIframe">
							{/* <iframe src={course && course.data && course.data.classes[lesson - 1].url} width="800" height="600" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe> */}
							<iframe id="iframe1" style={{display: 'flex'}} src={course && course.data && course.data.classes && course.data.classes[lesson - 1].url} width="1024" height="768" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)

}

const mapStateToProps = state => ({
	course: state.courses,
	auth: state.auth
	// profile: state.profile
});

export default connect(mapStateToProps, 
	{ getCoursesOwned, 
		getCourse, 
		finishLessonAction,
		lessonsWatchedAction })(CourseLessons);
