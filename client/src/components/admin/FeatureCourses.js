import React, {useRef, useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../actions/courses';
import './FeatureCourses.css';

const FeatureCourses = () => {
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const courses = useSelector(state => state.courses);

	

  const [data, setData] = useState();

	const allCourses = courses.all && courses.all.map((course, index) => {

    return <h2>{course.name}</h2>
		
  })
  
  useEffect(() => {
    dispatch(getCourses());
	}, []);

  

  let item = useRef();
  let itemOver = useRef();

  const onDragStart = (event) => {
    console.log("starting on Drag");
    item.current = event.target;
    // console.log(item.current);
    event
      .dataTransfer
      .setData('text/plain', event.target.id);
  
    event
      .currentTarget
      .style
      .backgroundColor = 'yellow';
  }

  const onDrop = (event) => {
    console.log("on drop starting");

    event.preventDefault();
    event.stopPropagation();
    const id = event
      .dataTransfer
      .getData('text');

      const draggableElement = document.getElementById(id);
      console.log(draggableElement);

      const dropzone = event.target;
      // dropzone.appendChild(draggableElement);
      dropzone.appendChild(item.current);

    //   event
    // .dataTransfer
    // .clearData();
  }

  const onDragOver = (event) => {
    // event.stopPropagation();
    console.log("calling OnDragOver");
    event.preventDefault();
    event.stopPropagation();
  }

  const onDragEnd = (e) => {
    item.current.style.display = 'block';

    e.target.classList.remove("drag-up");
    itemOver.current.classList.remove("drag-up");

    e.target.classList.remove("drag-down");
    itemOver.current.classList.remove("drag-down");
    
    let newData = [...data];
    let from = Number(item.current.dataset.id);
    let to = Number(itemOver.current.dataset.id);

    console.log(from);
    console.log(to);
    newData.splice(to, 0, newData.splice(from, 1)[0]);

    console.log(newData);
    // console.log(newData.splice(from, 1)[0])

    // //set newIndex to judge direction of drag and drop
    newData = newData.map((doc, index)=> {
      doc.newIndex = index + 1;
      return doc;
    })

    // console.log(newData);

    setData(newData);
  }

  const dragOverItem = (e) => {
    e.target.classList.remove("drag-down");
    e.target.classList.remove("drag-up");
    
    itemOver.current = e.target;
    console.log("ITEM OVER ");
    console.log(itemOver.current);

    console.log("EVENT TARGET ");
    console.log(e.target);

    item.current.style.display = "none";

    if (e.target.tagName !== "DIV") {
      return;
    }

    const dgIndex = JSON.parse(item.current.dataset.item).newIndex;
    console.log("dgIndex " + dgIndex);

    const taIndex = JSON.parse(itemOver.current.dataset.item).newIndex;
    console.log("taIndex " + taIndex);

    const animateName = dgIndex > taIndex ? "drag-up" : "drag-down";
    console.log("animateName " + animateName);


    if (itemOver.current && e.target.dataset.item !== itemOver.current.dataset.item) {
      itemOver.current.classList.remove("drag-up", "drag-down");
      // itemOver.current.classList.remove("drag-up", "drag-down");
      itemOver.current = e.target
    }

    if(!e.target.classList.contains(animateName)) {
      e.target.classList.add(animateName);
      // itemOver.current = e.target;
    }

  }

  // const allData = data.map((item, i) => {
  //   return (
  //     <div
  //         className="example-draggable"
  //         draggable="true"
  //         onDragStart={onDragStart}
  //         onDragEnd={onDragEnd}
  //         onDragOver={dragOverItem}
  //         data-id={i}
  //         data-item={JSON.stringify(item)}
         
  //     >{item.name}</div>
  //   )
  // })
  console.log(data)
  return (
    <div>
    <div className="example-parent">
      <h1>To-do list</h1>
      <div className="example-origin">
        To-do
        {allCourses}
      </div>
      <div>
        <h2>Featured Courses</h2>
        <div
          className="example-dropzone"
          onDrop={e => onDrop(e)}
          onDragOver={e => onDragOver(e)}
          data-id={5}
        >
          
        </div>
      </div>
    </div>
    </div>
  )
}

export default FeatureCourses
