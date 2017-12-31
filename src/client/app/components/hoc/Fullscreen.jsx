// @flow
import React, { PureComponent } from 'react';
import type { ClassComponent } from 'react-flow-types';

type State = {
	width: number;
	height: number;
}

export default (Wrapped: ClassComponent<any, any>) => class extends PureComponent<any, State> {
	constructor(props: Object) {
		super(props);
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
