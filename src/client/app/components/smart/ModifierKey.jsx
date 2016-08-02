import React from 'react';

const ModifierKey = (Wrapped) => class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			cmdPressed: false
		}
	}

	componentDidMount() {
		document.body.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.body.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	componentWillUnmount() {
		document.body.removeEventListener('keydown', this.handleKeyDown.bind(this));
		document.body.removeEventListener('keyup', this.handleKeyUp.bind(this));
	}

	handleKeyDown(e) {
		this.setState({
			cmdPressed: true
		})
	}

	handleKeyUp(e) {
		this.setState({
			cmdPressed: false
		})
	}

	render() {
		return (<Wrapped {...this.props} {...this.state} ></Wrapped>)
	}
}

export default ModifierKey