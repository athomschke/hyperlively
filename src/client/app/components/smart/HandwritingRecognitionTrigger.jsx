// @flow
import React, { Component } from 'react';
import last from 'lodash/last';
import { type Scene, type Stroke } from '../../typeDefinitions';

type Props = {
	scene: Scene,
	strokes: Array<Stroke>,
	returnPressed: boolean,
	handwritingRecognitionEnabled: boolean,
};

export default Wrapped => class extends Component {

	props: Props

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
