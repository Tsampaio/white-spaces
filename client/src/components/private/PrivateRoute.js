import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, auth: { isAuthenticated, active, loading }, ...rest }) => {
	useEffect(() => {
		console.log(active);
	}, [active])

	return (
		<Route
			{...rest}
			// render={props => !isAuthenticated || !activev
			render={props => (active == null && !loading)
				? (<Redirect to="/" />)
				: (<Component {...props} />)}
		/>
	)
}

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);