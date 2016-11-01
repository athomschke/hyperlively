import React, {Component, PropTypes} from 'react';

const Window = class Window extends Component {

	static propTypes = {
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		cmdPressed: PropTypes.bool
	};

	static defaultProps = {
		cmdPressed: false
	};

	render() {
		return (<div
			className="window"
			ref="window"
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				pointerEvents: this.props.cmdPressed ? 'none' : 'auto'
			}}/>);
	}

};

export default Window;