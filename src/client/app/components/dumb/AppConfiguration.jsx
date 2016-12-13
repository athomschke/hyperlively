import React, { PropTypes, Component } from 'react';


export default class AppConfiguration extends Component {

	static propTypes = {
		active: PropTypes.bool
	};

	static defaultProps = {
		active: true
	}

	getControlStyle() {
		return {
			position: 'absolute',
			pointerEvents: this.props.active ? 'auto' : 'none',
			top: 20,
			left: 20
		};
	}

	render() {
		return (
			<div id='configuration' style={this.getControlStyle()}>
				{this.props.children}
			</div>
		);
	}
}