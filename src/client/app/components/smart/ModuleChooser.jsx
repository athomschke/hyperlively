import React, {Component, PropTypes} from 'react';

'use strict'

const ModuleChooser = (possibleComponents) => class extends React.Component {
	
	static propTypes = {
		componentIndex: PropTypes.number
	};

	static defaultProps = {
		componentIndex: 0
	};

	render() {
		let ChosenMudule = possibleComponents[this.props.componentIndex];
		return <ChosenMudule ref="chosenComponent" {...this.props} />
	}
}

export default ModuleChooser