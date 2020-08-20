import React from 'react';
import './Loader.css';

const Loader = () => {
	return (
		// <div className="page">
		// 	<span className="loader" data-text="Loading...">Loading...</span>
		// </div>
		<div class="d-flex justify-content-center loaderCtn">
			<div class="spinner-border" role="status">
				<span class="sr-only">Loading...</span>
			</div>
		</div>
	)
}

export default Loader
