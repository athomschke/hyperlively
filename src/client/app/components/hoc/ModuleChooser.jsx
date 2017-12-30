// @flow
import React, { PureComponent, PropTypes } from 'react';
import type { Component } from 'react-flow-types';

export default (possibleComponents: Array<Component<Object>>) => class extends PureComponent {

	static propTypes = {
		componentIndex: PropTypes.number,
	};

	static defaultProps = {
		componentIndex: 0,
	};

	render() {
		const ChosenMudule = possibleComponents[this.props.componentIndex];
		if (ChosenMudule) {
			return <ChosenMudule {...this.props} />;
		}
		return <div />;
	}
};
