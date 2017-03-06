import React, { Component } from 'react';

export default Wrapped => class extends Component {

	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		this.handleResize = this.handleResize.bind(this);
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
