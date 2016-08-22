import React, { Component } from 'react';

export default (Wrapped) => class extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cmdPressed: false,
			ctrlPressed: false
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

	handleKeyDown(event) {
		if (event.metaKey && !event.ctrlKey) {
			this.setState({ cmdPressed: true });
		}
		if (event.ctrlKey) {
			this.setState({ ctrlPressed: true });
		}
	}

	handleKeyUp(event) {
		if (!event.metaKey || event.ctrlKey) {
			this.setState({ cmdPressed: false });
		}
		if (!event.ctrlKey) {
			this.setState({ ctrlPressed: false });
		}
	}

	render() {
		return (<Wrapped {...this.props} {...this.state} ></Wrapped>);
	}
};