// @flow
import React, { PureComponent } from 'react';
import type { Component } from 'react-flow-types';

export default (Wrapped: Component<Object>) => class extends PureComponent {

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
