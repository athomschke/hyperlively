import React, {Component, PropTypes} from 'react';

'use strict';

export default (possibleComponents) => class extends Component {
	
	static propTypes = {
		componentIndex: PropTypes.number
	};

	static defaultProps = {
		componentIndex: 0
	};

	render() {
		let ChosenMudule = possibleComponents[this.props.componentIndex];
		if (ChosenMudule) {
			return <ChosenMudule ref="chosenComponent" {...this.props} />;
		} else {
			return <div ref="chosenComponent" />;
		}
	}
};