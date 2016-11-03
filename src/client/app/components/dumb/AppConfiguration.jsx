import React, {Component} from 'react';

let getControlStyle = () => {
	return {
		position: 'absolute',
		top: 20,
		left: 20
	};
};

export default class AppConfiguration extends Component {

	render() {
		return (
			<div style={getControlStyle()}>
				{this.props.children}
			</div>
		);
	}
}