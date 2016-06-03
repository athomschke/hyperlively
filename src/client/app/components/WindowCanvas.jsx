import React, {Component, PropTypes} from 'react';
import Canvas from 'components/Canvas';

export default class WindowCanvas extends Component {

	handleResize(e) {
		this.setState({
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight
		})
	}

	constructor(props) {
		super(props);
		this.state = {
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight
		}
		this.handleResize = this.handleResize.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	render() {
		return <Canvas {...this.props}
			width = {this.state.windowWidth}
			height = {this.state.windowHeight}
		></Canvas>
	}

}