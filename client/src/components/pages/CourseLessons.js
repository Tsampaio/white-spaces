import React, { Fragment, useEffect, useState } from 'react';
import SecondHeader from '../partials/SecondHeader';
import styles from './CourseLesson.module.css';
import { useParams, Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourse, getCoursesOwned, finishLessonAction, lessonsWatchedAction } from '../../actions/courses';

const CourseLessons = () => {
	const dispatch = useDispatch();

	const auth = useSelector((state) => state.auth);
  const { user, token } = auth;
  const course = useSelector((state) => state.courses);
	const { loading } = course;

	const [page, setPage] = useState({
		loaded: false
	});

	let { courseTag, lesson } = useParams();

	lesson = parseInt(lesson);

	useEffect(() => {
		let isSubscribed = true;
		if (isSubscribed && token) {
			dispatch(getCourse(courseTag, user && user._id));
		}

		return () => (isSubscribed = false);
	}, [courseTag, user && user._id]);

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
			console.log("CALLING LESSONS WATCHED ACTION")
			dispatch(lessonsWatchedAction(courseTag, token));
		
	}, [dispatch, courseTag, token])

	// useEffect(() => {
	// 	console.log("calling redirect user")
	// 	if ( (page.loaded && auth && auth.user && auth.user.role !== "admin" && !checkCourseAccess) || (auth && auth.membership && auth.membership.active)) {
	// 		redirectUser();
	// 	}
	// }, [page.loaded, auth.membership, auth.user]);

	const setCoursesOwned = async () => {
		// await dispatch(getCoursesOwned(auth && auth.user && auth.user._id));

	}

	const totalLessons = course && course.data && course.data.classes && course.data.classes.length;
	// console.log(totalLessons);

	// console.log(course);
	// console.log(lesson)

	const checkLesson = (i) => {
		// console.log("INSIDE Checking Lesson");
		// console.log(theClass.watched)
		let classLength = course && course.classesWatched && course.classesWatched.length;
		// console.log("ClassLength is" + classLength);
		for (let y = 0; y < classLength; y++) {
			// console.log("Are there classes");
			// console.log(theClass.watched.length > 0)
			// console.log("++++++++++++++++++++++++++++++");
			// console.log("My Y is");
			// console.log(y);
			// console.log((course && course.classesWatched && course.classesWatched[y].lessonNumber))
			// console.log("My INDEX is");
			// console.log(i);
			// console.log("CLASS IS WATCHED:")
			// console.log(course && course.classesWatched && course.classesWatched[y].complete)
			// console.log("-------------------------------");
			
			if ((course && course.classesWatched && course.classesWatched[y].lessonNumber === i) && (course && course.classesWatched && course.classesWatched[y].complete)) {
				// console.log("We found a CLASS");
				return true
			} 
			
			// else {
			// 	return <i className="far fa-circle"></i>
			// }

		}

		return false
	}

	let classes = course && course.data && course.data.classes && course.data.classes.map((theClass, i) => {
		return (
			<div className={lesson === (i + 1) ? styles.lessonActiveCtn : ''}>
				<div className={i % 2 === 0 ? styles.lesson : `${styles.lesson} ${styles.stripe}`} key={i}>
					<div className={styles.lessonComplete} onClick={() => dispatch(finishLessonAction(i, course && course.data && course.data._id, auth && auth.token))}>
						{/* {	theClass.watched.complete ? 
							<i className="fas fa-check-circle complete"></i>
						: <i className="far fa-circle"></i>
						}  */}
						{/* {console.log("CHECKING LESSON")} */}
						{checkLesson(i) ? (
							<i className="fas fa-check-circle complete"></i>
						): <i className="far fa-circle"></i>}


					</div>
					<Link className={lesson === (i + 1) ? `${styles.lessonLink} ${styles.lessonActive}` : styles.lessonLink} to={`/courses/${course.data.tag}/lessons/${theClass.lecture}`}>
						{/* <i className="fas fa-play-circle"></i> */}
						<p>{theClass.title} <span className={styles.lessonTime}> <span className="d-none d-sm-block">- ({theClass.duration} mins)</span></span></p>
					</Link>
				</div>
			</div>
		);
	});

	const lessonContinue = () => {
		if ((lesson + 1) > totalLessons) {
			// console.log(lesson);
			// console.log("inside of if");
			return 	<Link to={lesson !== 1 ? `/courses/${course && course.data && course.data.tag}/lessons/${lesson - 1}`: '#'}><h1><i className="fas fa-arrow-left"></i> Previous Lesson </h1></Link>

		} else {
			// console.log("inside of else");
			return (
				<>
					<Link to={lesson !== 1 ? `/courses/${course && course.data && course.data.tag}/lessons/${lesson - 1}`: '#'}><h1><i className="fas fa-arrow-left"></i> Previous Lesson </h1></Link>
					<Link to={`/courses/${course && course.data && course.data.tag}/lessons/${lesson + 1}`}><h1>Next Lesson <i className="fas fa-arrow-right"></i></h1></Link>
				</>
			)
		}
	}

	const checkCourseAccess = auth && auth.coursesOwned && auth.coursesOwned.length > 0 && auth.coursesOwned.find((theCourse) => {
		return theCourse.tag === courseTag
	});

	// console.log(checkCourseAccess);

	// const percentageWatched = () => {
	// 	if (course && course.data && course.data.classes) {
	// 		const totalLessons = course && course.data && course.data.classes.length;

	// 		let totalLessonsWatched = 0;

	// 		for (let i = 0; i < course.data.classes.length; i++) {
	// 			//  console.log(course.data.classes[i]);
	// 			if (course.data.classes[i].watched.length > 0 && course.data.classes[i].watched[0].complete) {
	// 				totalLessonsWatched += 1;
	// 			}
	// 		}

	// 		return (totalLessonsWatched * 100 / totalLessons).toFixed(0);
	// 	}
	// }


	const redirectUser = () => {
		if (auth && auth.user && auth.user.role !== "admin" && !checkCourseAccess && !auth.membership.active && page.loaded) {
			return <Redirect to="/courses" />
		}
	}

	// console.log(course.classesWatched);

	return (
		<Fragment>
			<SecondHeader />
			<div className={`container-fluid ${styles.courseLesson}`}>
				<div className={`row ${styles.classesCol}`}>
					<div className={styles.courseLinksCtn}>
						<h1><i className="far fa-play-circle"></i><span>{course && course.data && course.data.name}</span></h1>

						<h5 className={styles.courseCurriculum}>Progress: {course && course.courseProgress}% <span>complete</span></h5>
						<div className={styles.lessonsCtn}>
							{classes}
						</div>
					</div>
					<div className={`${styles.courseLinksCtn} ${styles.backup}`}>

					</div>
					<div className={styles.courseMainVideoCtn}>
						<div className={styles.nextPrevButtonsCtn}>
							{lessonContinue()}
						</div>
						<div className={styles.currentLessonTitle}>
							<i class="fas fa-chalkboard-teacher"></i>
							<p>{course && course.data && course.data.classes && course.data.classes[lesson - 1].title}</p>
						</div>

						<div className={`${styles.videoIframe} embed-responsive embed-responsive-16by9`}>
							<iframe className="embed-responsive-item" id="iframe1" style={{display: 'flex'}} src={course && course.data && course.data.classes && course.data.classes[lesson - 1].url} width="1024" height="768" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen title="courseClass"></iframe>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)

}

// const mapStateToProps = state => ({
// 	course: state.courses,
// 	auth: state.auth
// 	// profile: state.profile
// });

export default CourseLessons;
