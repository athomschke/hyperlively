import React, { PropTypes, Component } from 'react';
import { configuration } from 'stylesheets/components/dumb/AppConfiguration';

export default class AppConfiguration extends Component {

	static propTypes = {
		active: PropTypes.bool
	};

	static defaultProps = {
		active: true
	}

	render() {
		return (
			<div id='configuration' className={configuration}
				style={{
					pointerEvents: this.props.active ? 'auto' : 'none'
				}}
			>
				{this.props.children}
			</div>
		);
	}
}