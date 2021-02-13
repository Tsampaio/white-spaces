import React from 'react';
import SecondHeader from './SecondHeader';
import { Link } from 'react-router-dom';

import './Header.css';

const Header = () => {
	return (
		<header>
			<SecondHeader />
			<div className="heroTitle">
				<div className="container">
					<div className="row">
						<div className="col-sm-12">
							<h3>LEARN TO CODE</h3>
							<h1>GET YOUR DREAM JOB</h1>
							<Link to="/courses" className="actionButton">VIEW COURSES</Link>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

export default Header;