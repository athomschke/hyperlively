import React, { Component } from 'react';

export default (Wrapped) => class extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cmdPressed: false
		};
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown.bind(this));
		window.removeEventListener('keyup', this.handleKeyUp.bind(this));
	}

	handleKeyDown() {
		this.setState({
			cmdPressed: true
		});
	}

	handleKeyUp() {
		this.setState({
			cmdPressed: false
		});
	}

	render() {
		return (<Wrapped {...this.props} {...this.state} ></Wrapped>);
	}
};