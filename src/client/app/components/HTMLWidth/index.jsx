// @flow
import * as React from 'react';

type State = {
	htmlWidth: number,
}

export type HTMLWidthProps<P> = P

type WrappedProps<P> = HTMLWidthProps<P>;

export default (Wrapped: React.ComponentType<WrappedProps<any>>) =>
	class HTMLWidth extends React.PureComponent<HTMLWidthProps<*>, State> {
		constructor() {
			super();
			this.state = {
				htmlWidth: 0,
			};
		}

		state: State

		componentDidMount() {
			this.state.htmlWidth = ((this.node: any): HTMLDivElement).getBoundingClientRect().width;
		}

		props: HTMLWidthProps<*>

		node: HTMLDivElement | null

		render() {
			return (<div
				ref={(node) => { this.node = node; }}
				style={{
					width: '100%',
				}}
			>
				<Wrapped {...this.props} {...this.state} />
			</div>);
		}
	};
