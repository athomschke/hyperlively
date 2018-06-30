// @flow
import * as React from 'react';

type State = {
	htmlWidth: number,
}

type Props<P> = P

type WrappedProps<P> = Props<P>;

export default (Wrapped: React.ComponentType<WrappedProps<any>>) =>
	class HTMLWidth extends React.PureComponent<Props<any>, State> {
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

		props: Props<any>

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
