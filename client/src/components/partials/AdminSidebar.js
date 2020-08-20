import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
	return (
		<div className="col-2 adminSidebar">
			<ul>
				<li>
					<Link to="/admin/courses" className="adminSidebarLinks"><i className="fa fa-play-circle"></i>Courses</Link>
				</li>
			</ul>
		</div>
	)
}

export default AdminSidebar;
