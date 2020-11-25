import React, {useRef, useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, saveFeaturedCoursesAction } from '../../actions/courses';
import './FeatureCourses.css';

const FeatureCourses = () => {
  const dispatch = useDispatch();
  
  const auth = useSelector(state => state.auth);
  const {loading, token} = auth;

  
  const courses = useSelector(state => state.courses);
  const courseLoading = courses.loading;
  const { message } = courses;

  courses.all.length > 0 && courses.all.sort((a, b) => {
    return a.featuredPosition - b.featuredPosition;
  })
  
  const [data, setData] = useState(courses.all);

  const [allItems, setAllItems] = useState([])

  const updateCourses = () => {
    const allupdatedCourses = courses.all.length > 0 && courses.all.map((course, i) => {
      return {
        id: course._id,
        name: course.name,
        tag: course.tag,
        price: course.price,
        newIndex: i + 1,
        featured: course.featured,
        featuredPosition: i + 1
      }
    });

    console.log(allupdatedCourses);

    setData(allupdatedCourses);
  }
  
  useEffect(() => {
    dispatch(getCourses());
  }, [loading]);
  
  useEffect(() => {
    if( !courseLoading ) {
      updateCourses();
    }

	}, [courseLoading]);

  

  let item = useRef();
  let itemOver = useRef();
  let dropzoneRef = useRef();

  const onDragStart = (event) => {
    console.log("---- ON DRAG START -------");
    item.current = event.target;
    console.log(item.current);
    event
      .dataTransfer
      .setData('text/plain', event.target.id);
  
    // event
    //   .currentTarget
    item.current
      .style
      .backgroundColor = 'yellow';
  }

  const onDrop = (event) => {
    console.log("on drop starting");
    console.log(item.current);
    console.log(itemOver.current);
    let currenTarget = itemOver.current;
    event.preventDefault();
    event.stopPropagation();
    // const id = event
    //   .dataTransfer
    //   .getData('text');

    //   console.log(id);
    //   const draggableElement = document.getElementById(id);
    //   console.log(draggableElement);

      const dropzone = event.target;
      // dropzone.appendChild(draggableElement);
      dropzone.appendChild(itemOver.current);

      const test = [...allItems, itemOver.current]

      setAllItems(test);
      console.log(currenTarget.dataset.item);
      // setFeatureCourses([...featureCourses, JSON.parse(dropzone.querySelector(".example-draggable").dataset.item) ]);
      // console.log(JSON.parse(dropzone.querySelector(".example-draggable").dataset.item));

      // const allFeatureCourses = [];
      // let featureCourseNodes = dropzoneRef.current.querySelectorAll(".example-draggable");
      // for(let i=0; i < featureCourseNodes.length; i++) {
      //   allFeatureCourses.push(featureCourseNodes[i].dataset.item);
      // }

      // console.log(featureCourses);
      

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
    console.log("----ON DRAG END---------");
    console.log(item.current);
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

    // console.log(newData);
    // console.log(newData.splice(from, 1)[0])

    // //set newIndex to judge direction of drag and drop
    newData = newData.map((doc, index)=> {
      doc.newIndex = index + 1;
      return doc;
    })

    console.log(newData);

    setData(newData);

    // console.log(dropzoneRef.current.dataset.id);
    // console.log(dropzoneRef.current.querySelectorAll(".example-draggable")[0]);
    // console.log(dropzoneRef.current.querySelectorAll(".example-draggable"));

    // const allFeatureCourses = [];
    //   let featureCourseNodes = dropzoneRef.current.querySelectorAll(".example-draggable");
    //   console.log(featureCourseNodes);
    //   for(let i=0; i < featureCourseNodes.length; i++) {
    //     console.log("THIS IS");
    //     console.log(featureCourseNodes[i]);
    //     console.log(JSON.parse(featureCourseNodes[i].dataset.item));
    //     allFeatureCourses.push(JSON.parse(featureCourseNodes[i].dataset.item));
    //   }

    // console.log(allFeatureCourses);
  }

  const dragOverItem = (e) => {
    console.log("------ DRAG OVER ITEM -----");
    console.log(item.current);
    

      let featureCourseNodes = document.querySelectorAll(".example-draggable");
      for(let i=0; i < featureCourseNodes.length; i++) {
        featureCourseNodes[i].classList.remove("drag-up", "drag-down");
      }


    
    //itemOver.current = e.target;
    itemOver.current = e.target;
    // item.current = e.target;
    console.log("ITEM OVER ");
    console.log(itemOver.current);

    console.log("EVENT TARGET ");
    console.log(item.current);

    item.current.style.display = "none";
    //itemOver.current.style.display = "none";

    if (e.target.tagName !== "DIV") {
      return;
    }

    const fromIndex = JSON.parse(item.current.dataset.item).newIndex;
    console.log("fromIndex " + fromIndex);

    const toIndex = JSON.parse(itemOver.current.dataset.item).newIndex;
    console.log("toIndex " + toIndex);

    const animateName = fromIndex > toIndex ? "drag-up" : "drag-down";
    console.log("animateName " + animateName);


    if (itemOver.current && item.current.dataset.item !== itemOver.current.dataset.item) {
      itemOver.current.classList.remove("drag-up", "drag-down");
      // itemOver.current.classList.remove("drag-up", "drag-down");
      // itemOver.current = e.target
    }

    if(!itemOver.current.classList.contains(animateName)) {
      itemOver.current.classList.add(animateName);
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

  const updateFeatureCourses = (i) => {
    console.log("Updating!!!");
    let copyFeature = [...data];
    
    console.log(copyFeature[i]);
    console.log(copyFeature[i].featured)
    copyFeature[i] = {
      ...copyFeature[i],
      featured: !copyFeature[i].featured
    }

    console.log(copyFeature[i].featured);
    setData(copyFeature)
  }

  const allCourses = data.length > 0 && data.map((course, i) => {
    // if(course.name === "css animation") {
    //   console.log(course.name);
    //   console.log(course.featured)
    // }
    return (
      <div key={i}>
        <div className="example-draggable"
            draggable="true"
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={dragOverItem}
            data-id={i}
            data-item={JSON.stringify(course)}
        >{course.name}</div>
        <input type="checkBox" value={course.featured} checked={course.featured ? "checked" : false} onChange={() => updateFeatureCourses(i)}/>
      </div>
    )
		
  })

  // const allFeatureCourses = featureCourses.length > 0 && featureCourses.map((course, i) => {

  //   return (
  //     <div className="example-draggable"
  //         draggable="true"
  //         onDragStart={onDragStart}
  //         onDragEnd={onDragEnd}
  //         onDragOver={dragOverItem}
  //         data-id={i}
  //         data-item={course}
  //     >{course.name}</div>
  //   )
		
  // })

  const saveFeaturedCourses = (e) => {
    // const filteredData = data.filter((course) => {
    //   return course.featured;
    // })
    e.preventDefault();
    console.log(data);
    dispatch(saveFeaturedCoursesAction(data, token));
  }

  console.log(data)
  return (
    <div>
    <div className="example-parent">
      <h1>To-do list</h1>
      <div className="example-origin">
        To-do
        {allCourses}
        <button onClick={saveFeaturedCourses}>Save Feature courses</button>
        { message ? ( 
          <h3>{message}</h3> 
        ) : null}
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
