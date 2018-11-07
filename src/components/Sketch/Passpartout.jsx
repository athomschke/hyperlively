// @flow
import * as React from 'react';

import type { OnNodeChangedFunction } from 'src/types';

type Props = {
	onNodeChanged?: OnNodeChangedFunction,
	children: React.Node,
	active?: boolean,
	finished?: boolean,
	bounds: {
		x: number,
		y: number,
		width: number,
		height: number
	},
	showBorder: boolean,
}

export default class Passpartout extends React.PureComponent<Props> {
	static defaultProps = {
		onNodeChanged: (_divElement: HTMLDivElement) => null,
		finished: false,
		active: false,
	}

	props: Props

	calculatePassepartoutStyle() {
		return {
			position: 'absolute',
			top: this.props.bounds.y,
			left: this.props.bounds.x,
			pointerEvents: this.props.active && this.props.finished ? 'auto' : 'none',
			width: this.props.bounds.width,
			height: this.props.bounds.height,
			borderLeft: `${this.props.showBorder ? '1' : '0'}px solid black`,
		};
	}

	render() {
		return (
			<div
				ref={(divNode) => {
					if (this.props.onNodeChanged) {
						this.props.onNodeChanged(divNode);
					}
				}}
				style={this.calculatePassepartoutStyle()}
			>
				{this.props.children}
			</div>
		);
	}
}
