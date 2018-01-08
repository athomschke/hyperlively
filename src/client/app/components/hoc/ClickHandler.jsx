import * as React from 'react';
import type { ClassComponent } from 'react-flow-types';
import type { SyntheticMouseEvent } from 'flow-bin';

type Props = {
	onClick: (evt: SyntheticMouseEvent) => void;
}

type State = {
	mouseDown: boolean;
}

export default function (Wrapped: ClassComponent<any, any>) {
	return class ClickHandler extends React.Component {
		props: Props
		state: State

		constructor(props: any) {
			super(props);
			this.state = {
				mouseDown: false,
			};
			this.handleMouseDown = this.handleMouseDown.bind(this);
			this.handleMouseUp = this.handleMouseUp.bind(this);
		}

		handleMouseDown() {
			this.state.mouseDown = true;
		}

		handleMouseUp(evt: SyntheticMouseEvent) {
			if (this.state.mouseDown) {
				evt.persist();
				this.props.onClick(evt);
				this.state.mouseDown = false;
			}
		}

		render() {
			return (
				<div
					onMouseDown={this.handleMouseDown}
					onMouseUp={this.handleMouseUp}
				>
					<Wrapped {...this.props} />
				</div>
			);
		}
	};
}
