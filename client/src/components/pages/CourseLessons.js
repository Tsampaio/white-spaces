import React, { Fragment, useEffect } from 'react';
import SecondHeader from '../partials/SecondHeader';
import './CourseLesson.css';
import store from '../../store';
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCourse } from '../../actions/courses';

const CourseLessons = ({ course }) => {
	useEffect(() => {
		store.dispatch(getCourse(courseTag));

	}, []);

	let { courseTag, lesson } = useParams();

	lesson = parseInt(lesson);

	const totalLessons = course && course.data && course.data.classes.length;
	console.log(totalLessons);

	console.log(course);
	console.log(lesson)

	let classes = course && course.data && course.data.classes.map((theClass, i) => {
		return (
			<div className="lesson" key={i}>
				<div className="lessonComplete"></div>
				<Link className={lesson === (i + 1) ? "lessonLink lessonActive" : "lessonLink"} to={`/courses/${course.data.tag}/lessons/${theClass.lecture}`}>
					<i className="fas fa-play-circle"></i>
					<p>{theClass.title} <span className="lessonTime"> - ({theClass.duration} mins)</span></p>
				</Link>
			</div>
		);
	});

	const lessonContinue = () => {
		if ((lesson + 1) > totalLessons) {
			console.log(lesson);
			console.log("inside of if");
			return <h1>Last Lesson of the Course!</h1>
		} else {
			console.log("inside of else");
			return <Link to={`/courses/${course && course.data && course.data.tag}/lessons/${lesson + 1}`}><h1>Next Lesson <i className="fas fa-arrow-right"></i></h1></Link>
		}
	}

	return (
		<Fragment>
			<SecondHeader />
			<div className="container-fluid courseLesson">
				<div className="row">
					<div className="col-4">
						<h1>{course && course.data && course.data.name}</h1>

						<h5 className="courseCurriculum">Curriculum</h5>
						<div className="lessonsCtn">

							{classes}
							{/* <div className="lesson">
							<div className="lessonComplete"></div>
							<i class="fas fa-play-circle"></i>
							<p>Building the frontend interface <span className="lessonTime">(13:54)</span></p>
						</div>
						<div className="lesson">
							<div className="lessonComplete"></div>
							<i class="fas fa-play-circle"></i>
							<p>Building the frontend interface <span className="lessonTime">(13:54)</span></p>
						</div>
						<div className="lesson">
							<div className="lessonComplete"></div>
							<i class="fas fa-play-circle"></i>
							<p>Building the frontend interface <span className="lessonTime">(13:54)</span></p>
						</div>
						<div className="lesson">
							<div className="lessonComplete"></div>
							<i class="fas fa-play-circle"></i>
							<p>Building the frontend interface <span className="lessonTime">(13:54)</span></p>
						</div> */}

						</div>
					</div>
					<div className="col-8">
						{lessonContinue()}
						<div className="currentLessonTitle">
							<i className="fas fa-play-circle"></i>
							<p>{course && course.data && course.data.classes[lesson - 1].title}</p>
						</div>

						<div className="videoIframe">
							<iframe src={course && course.data && course.data.classes[lesson - 1].url} width="800" height="600" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

const mapStateToProps = state => ({
	course: state.courses
	// profile: state.profile
});

export default connect(mapStateToProps)(CourseLessons);
