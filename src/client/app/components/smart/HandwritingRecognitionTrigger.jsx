import React, { Component, PropTypes } from 'react';
import last from 'lodash/last';

export default Wrapped => class extends Component {

	static propTypes = {
		scene: PropTypes.object,
		strokes: PropTypes.arrayOf(PropTypes.object),
		returnPressed: PropTypes.bool,
		handwritingRecognitionEnabled: PropTypes.bool,
	};

	static defaultProps = {
		strokes: [],
		scene: { strokes: [] },
		returnPressed: false,
		handwritingRecognitionEnabled: false,
	}

	componentDidMount() {
		this.state = {
			handwritingRecognitionEnabled: false,
		};
	}

	doRecognize() {
		return this.props.handwritingRecognitionEnabled &&
			this.props.returnPressed &&
			last(this.props.scene.strokes) === last(this.props.strokes) &&
			last(this.props.strokes).finished;
	}

	componentDidUpdate() {
		if (!this.state.useHandwritingRecognition && this.doRecognize()) {
			this.state.useHandwritingRecognition = true;
		} else if (this.state.useHandwritingRecognition && !this.doRecognize()) {
			this.state.useHandwritingRecognition = false;
		}
	}

	render() {
		return (<Wrapped {...this.props} {...this.state} />);
	}
};
