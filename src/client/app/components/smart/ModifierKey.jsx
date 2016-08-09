import React, { Component } from 'react';

export default (Wrapped) => class extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cmdPressed: false
		};
	}

	componentDidMount() {
		document.body.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.body.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	componentWillUnmount() {
		document.body.removeEventListener('keydown', this.handleKeyDown.bind(this));
		document.body.removeEventListener('keyup', this.handleKeyUp.bind(this));
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