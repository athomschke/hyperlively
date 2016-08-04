import React, { Component } from 'react';

const Fullscreen = (Wrapped) => class extends Component {

	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight
		}
		this.handleResize = this.handleResize.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize(e) {
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight
		})
	}

	render() {
		return (<Wrapped {...this.props} {...this.state}></Wrapped>)
	}
}

export default Fullscreen