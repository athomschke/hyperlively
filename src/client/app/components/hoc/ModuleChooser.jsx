// @flow
import React, { PureComponent, PropTypes } from 'react';
import type { ClassComponent } from 'react-flow-types';

export default (components: Array<ClassComponent<any, any>>) => class extends PureComponent<any> {

	static propTypes = {
		componentIndex: PropTypes.number,
	};

	static defaultProps = {
		componentIndex: 0,
	};

	render() {
		const ChosenMudule = components[this.props.componentIndex];
		if (ChosenMudule) {
			return <ChosenMudule {...this.props} />;
		}
		return <div />;
	}
};
