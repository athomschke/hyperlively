// @flow
import React, { PureComponent, PropTypes } from 'react';

const Window = class Window extends PureComponent {

	static propTypes = {
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		cmdPressed: PropTypes.bool,
	};

	static defaultProps = {
		width: 0,
		height: 0,
		cmdPressed: false,
	};

	render() {
		return (<div
			className="window"
			style={{
				position: 'absolute',
				width: '60%',
				height: '100%',
				top: 0,
				left: 0,
				pointerEvents: this.props.cmdPressed ? 'none' : 'auto',
			}}
		/>);
	}

};

export default Window;
