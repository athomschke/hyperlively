// @flow
import React, { PureComponent } from 'react';

import { relativeDividerPosition } from 'src/client/app/constants/configuration';

type Props<P> = P & {
	cmdPressed: boolean;
};

const Window = class Window extends PureComponent<Props<any>> {
	static defaultProps = {
		cmdPressed: false,
	};

	props: Props<any>;

	render() {
		return (<div
			className="window"
			style={{
				position: 'absolute',
				width: `${relativeDividerPosition * 100}%`,
				height: '100%',
				top: 0,
				left: 0,
				pointerEvents: this.props.cmdPressed ? 'none' : 'auto',
			}}
		/>);
	}

};

export default Window;
