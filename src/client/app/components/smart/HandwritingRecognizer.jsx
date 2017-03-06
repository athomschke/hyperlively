import React, { Component, PropTypes } from 'react';
import { map, last, flatten } from 'lodash';
import { HmacSHA512, enc } from 'crypto-js';
import { APPLICATION_KEY, HMAC_KEY, TEXT_RECOGNITION_URL, SHAPE_RECOGNITION_URL } from 'constants/handwriting';
import { strokesToComponents, getStringInput } from 'helpers/handwritingRecognizer';

const hmacData = stringInput =>
	encodeURIComponent(HmacSHA512(stringInput, APPLICATION_KEY + HMAC_KEY)
		.toString(enc.Hex));

const getShapeInput = strokes => JSON.stringify({
	components: strokes,
	doBeautification: true,
});

const applicationKeyData = () => encodeURIComponent(APPLICATION_KEY);

const encodedInputData = input => encodeURIComponent(input);

export default Wrapped => class extends Component {

	static propTypes = {
		strokes: PropTypes.arrayOf(PropTypes.object),
		onTextDetected: PropTypes.func,
		onShapeDetected: PropTypes.func,
		useHandwritingRecognition: PropTypes.bool,
	};

	static defaultProps = {
		strokes: [],
		onTextDetected: () => {},
		onShapeDetected: () => {},
		useHandwritingRecognition: false,
	}

	componentDidMount() {
		this.state = {
			hasRecognized: false,
		};
	}

	xmlHttpRequest(url, callback) {
		const xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		xmlhttp.withCredentials = true;
		xmlhttp.setRequestHeader('Accept', 'application/json');
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
		xmlhttp.onreadystatechange = callback.bind(this, xmlhttp);
		return xmlhttp;
	}

	onReadyStateChange(request) {
		if (request.readyState === 4 && request.status === 200) {
			const answer = JSON.parse(request.responseText);
			if (answer && answer.result) {
				this.dispatchResult(answer.result);
			}
		}
	}

	dispatchResult(result) {
		if (result.textSegmentResult) {
			const candidates = result.textSegmentResult.candidates;
			if (candidates.length > 0) {
				this.props.onTextDetected(candidates);
			}
		} else if (result.segments && result.segments.length > 0) {
			this.props.onShapeDetected(flatten(map(result.segments, 'candidates')));
		}
	}


	recognizeText(components) {
		const stringInput = getStringInput(components);
		const data = `applicationKey=${applicationKeyData()}&textInput=${encodedInputData(stringInput)}&hmac=${hmacData(stringInput)}`;
		this.xmlHttpRequest(TEXT_RECOGNITION_URL, this.onReadyStateChange.bind(this)).send(data);
	}

	recognizeShape(components) {
		const shapeInput = getShapeInput(components);
		const data = `applicationKey=${applicationKeyData()}&shapeInput=${encodedInputData(shapeInput)}&hmac=${hmacData(shapeInput)}`;
		this.xmlHttpRequest(SHAPE_RECOGNITION_URL, this.onReadyStateChange.bind(this)).send(data);
	}

	recognize() {
		const components = strokesToComponents(this.props.strokes);
		this.recognizeText(components);
		this.recognizeShape(components);
	}

	newStrokeStarted() {
		return this.state.hasRecognized &&
			last(this.props.strokes) &&
			!last(this.props.strokes).finished;
	}

	componentDidUpdate() {
		if (this.state.hasRecognized && this.newStrokeStarted()) {
			this.setState({
				hasRecognized: false,
			});
		} else if (this.props.useHandwritingRecognition && !this.state.hasRecognized) {
			this.setState({
				hasRecognized: true,
			}, this.recognize.bind(this));
		}
	}

	render() {
		return (<Wrapped {...this.props} {...this.state} />);
	}
};
