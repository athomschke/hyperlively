// @flow
import React, { PureComponent } from 'react';

export default Wrapped => class extends PureComponent {

	constructor(props: Object) {
		super(props);
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		this.handleResize = this.handleResize.bind(this);
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
