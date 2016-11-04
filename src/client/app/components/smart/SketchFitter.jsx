import React, { Component, PropTypes } from 'react';
import { cloneDeep } from 'lodash';

export default (Wrapped) => class extends Component {
	
	static propTypes = {
		bounds: PropTypes.object.isRequired,
		fittedWidth: PropTypes.number.isRequired,
		fittedHeight: PropTypes.number.isRequired
	};

	render() {
		let clonedBounds = cloneDeep(this.props.bounds);
		clonedBounds.width = this.props.fittedWidth;
		clonedBounds.height = this.props.fittedHeight;
		return (<Wrapped {...this.props}
			bounds = {clonedBounds}
		></Wrapped>);
	}

};