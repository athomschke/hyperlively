// @flow
import * as React from 'react';

export type ClickHandlerProps<P> = P & {
	onClick: (evt: SyntheticMouseEvent<HTMLElement>) => void;
}

type State = {
	mouseDown: boolean;
}

type WrappedProps<P> = P

export default function (Wrapped: React.ComponentType<WrappedProps<any>>) {
	return class ClickHandler extends React.Component<ClickHandlerProps<any>, State> {
		props: ClickHandlerProps<any>
		state: State

		constructor() {
			super();
			this.state = {
				mouseDown: false,
			};
			(this:any).handleMouseDown = this.handleMouseDown.bind(this);
			(this:any).handleMouseUp = this.handleMouseUp.bind(this);
		}

		handleMouseDown(_evt: SyntheticMouseEvent<HTMLElement>) {
			this.state.mouseDown = true;
		}

		handleMouseUp(evt: SyntheticMouseEvent<HTMLElement>) {
			if (this.state.mouseDown) {
				evt.persist();
				this.props.onClick(evt);
				this.state.mouseDown = false;
			}
		}

		render() {
			// eslint-disable-next-line no-unused-vars
			const { _onClick, ...rest } = this.props;
			return (
				<div
					onMouseDown={this.handleMouseDown}
					onMouseUp={this.handleMouseUp}
				>
					<Wrapped {...rest} />
				</div>
			);
		}
	};
}
