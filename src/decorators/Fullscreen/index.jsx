// @flow
import * as React from 'react';

type State = {
	width: number;
	height: number;
}

export type FullscreenProps<P> = P;

export default (Wrapped: React.ComponentType<any>) => class Fullscreen extends React.PureComponent<any, State> {
	constructor() {
		super();
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		(this:any).handleResize = this.handleResize.bind(this);
	}

	state: {
		width: number,
		height: number,
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize() {
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	}

	render() {
		return (<Wrapped {...this.props} {...this.state} />);
	}
};
