import React, { Component } from 'react';

export default Wrapped => class extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cmdPressed: false,
			ctrlPressed: false,
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
		if (event.which === 13 || event.keyCode === 13) {
			this.setState({ returnPressed: true });
		}
		if (event.ctrlKey) {
			this.setState({ ctrlPressed: true });
		}
	}

	handleKeyUp(event) {
		if (this.state.cmdPressed && (!event.metaKey || event.ctrlKey)) {
			this.setState({ cmdPressed: false });
		}
		if (this.state.returnPressed && (event.which === 13 && event.keyCode === 13)) {
			this.setState({ returnPressed: false });
		}
		if (this.state.ctrlPressed && !event.ctrlKey) {
			this.setState({ ctrlPressed: false });
		}
	}

	render() {
		return (<Wrapped {...this.props} {...this.state} />);
	}
};
