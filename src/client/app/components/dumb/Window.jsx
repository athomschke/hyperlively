// @flow
import React, { PureComponent } from 'react';

type Props = {
	relativeDividerPosition: number;
	cmdPressed: boolean;
};

const Window = class Window extends PureComponent<Props> {
	static defaultProps = {
		relativeDividerPosition: 0.6,
		cmdPressed: false,
	};

	props: Props;

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
