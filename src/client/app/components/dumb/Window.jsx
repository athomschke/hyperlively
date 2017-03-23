// @flow
import React, { PureComponent, PropTypes } from 'react';

const Window = class Window extends PureComponent {

	static propTypes = {
		relativeDividerPosition: PropTypes.number.isRequired,
		cmdPressed: PropTypes.bool,
	};

	static defaultProps = {
		relativeDividerPosition: 0.6,
		cmdPressed: false,
	};

	render() {
		return (<div
			className="window"
			style={{
				position: 'absolute',
				width: `${this.props.relativeDividerPosition * 100}%`,
				height: '100%',
				top: 0,
				left: 0,
				pointerEvents: this.props.cmdPressed ? 'none' : 'auto',
			}}
		/>);
	}

};

export default Window;
