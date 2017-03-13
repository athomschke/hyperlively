// @flow
import React, { PropTypes, Component } from 'react';
import { configuration } from 'stylesheets/components/dumb/AppConfiguration.scss';

export default class AppConfiguration extends Component {

	static propTypes = {
		active: PropTypes.bool,
		children: PropTypes.arrayOf(PropTypes.object),
	};

	static defaultProps = {
		active: true,
		children: [],
	}

	render() {
		return (
			<div
				id="configuration"
				className={configuration}
				style={{
					pointerEvents: this.props.active ? 'auto' : 'none',
				}}
			>
				{this.props.children}
			</div>
		);
	}
}
