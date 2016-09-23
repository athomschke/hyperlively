import React, { Component, PropTypes } from 'react';
import { map, last, flatten } from 'lodash';
import { APPLICATION_KEY, HMAC_KEY, TEXT_RECOGNITION_URL, SHAPE_RECOGNITION_URL, TEXT_INPUT_TYPE, LANGUAGE, TEXT_INPUT_MODE } from 'constants/handwriting';
import { HmacSHA512, enc } from 'crypto-js';

export default (Wrapped) => class extends Component {

	static propTypes = {
		strokes: PropTypes.array,
		onTextDetected: PropTypes.func,
		onShapeDetected: PropTypes.func,
		useHandwritingRecognition: PropTypes.bool
	};

	static defaultProps = {
		strokes: [],
		onTextDetected: () => {},
		onShapeDetected: () => {},
		useHandwritingRecognition: false
	}

	constructor(props) {
		super(props);
		this.state = {
			hasRecognized: false,
			candidates: []
		};
	}

	strokesToComponents(strokes) {
		return map(strokes, (stroke) => {
			return {
				type: 'stroke',
				x: map(stroke.points, 'x'),
				y: map(stroke.points, 'y'),
				t: map(stroke.points, 'timestamp')
			};
		});
	}

	getStringInput(strokes) {
		return JSON.stringify({
			textParameter: {
				textProperties: {},
				language: LANGUAGE,
				textInputMode: TEXT_INPUT_MODE
			},
			inputUnits: [{
				textInputType: TEXT_INPUT_TYPE,
				components: strokes
			}]
		});
	}

	getShapeInput(strokes) {
		return JSON.stringify({
			components: strokes,
			doBeautification:true
		});
	}

	xmlHttpRequest(url, callback) {
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		xmlhttp.withCredentials = true;
		xmlhttp.setRequestHeader('Accept', 'application/json');
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
		xmlhttp.onreadystatechange = callback.bind(this, xmlhttp);
		return xmlhttp;
	}

	onReadyStateChange(request) {
		if (request.readyState == 4 && request.status == 200) {
			let answer = JSON.parse(request.responseText);
			answer && answer.result && this.dispatchResult(answer.result);
		}
	}

	dispatchResult(result) {
		if (result.textSegmentResult) {
			let candidates = result.textSegmentResult.candidates;
			if (candidates.length > 0) {
				this.props.onTextDetected(candidates);
			}

		} else if (result.segments && result.segments.length > 0) {
			this.props.onShapeDetected(flatten(map(result.segments, 'candidates')));
		}
	}

	hmacData(stringInput) {
		return encodeURIComponent(HmacSHA512(stringInput, APPLICATION_KEY + HMAC_KEY).toString(enc.Hex));
	}

	applicationKeyData() {
		return encodeURIComponent(APPLICATION_KEY);
	}

	encodedInputData(input) {
		return encodeURIComponent(input);
	}

	recognizeText(components) {
		let stringInput = this.getStringInput(components);
		let data = `applicationKey=${this.applicationKeyData()}&textInput=${this.encodedInputData(stringInput)}&hmac=${this.hmacData(stringInput)}`;
		this.xmlHttpRequest(TEXT_RECOGNITION_URL, this.onReadyStateChange.bind(this)).send(data);
	}

	recognizeShape(components) {
		let shapeInput = this.getShapeInput(components);
		let data = `applicationKey=${this.applicationKeyData()}&shapeInput=${this.encodedInputData(shapeInput)}&hmac=${this.hmacData(shapeInput)}`;
		this.xmlHttpRequest(SHAPE_RECOGNITION_URL, this.onReadyStateChange.bind(this)).send(data);
	}

	recognize() {
		let components = this.strokesToComponents(this.props.strokes);
		this.recognizeText(components);
		this.recognizeShape(components);
	}

	newStrokeStarted() {
		return this.state.hasRecognized && last(this.props.strokes) && !last(this.props.strokes).finished;
	}

	componentDidUpdate() {
		if (this.state.hasRecognized && this.newStrokeStarted()) {
			this.setState({
				hasRecognized: false
			});
		} else if (this.props.useHandwritingRecognition && !this.state.hasRecognized) {
			this.setState({
				hasRecognized: true
			}, this.recognize.bind(this));
		}
	}

	render() {
		return (<Wrapped {...this.props} {...this.state} ></Wrapped>);
	}
};