import React, { Component, PropTypes } from 'react';
import { map, last } from 'lodash';
import { APPLICATION_KEY, HMAC_KEY, RECOGNITION_URL, TEXT_INPUT_TYPE, LANGUAGE, TEXT_INPUT_MODE } from 'constants/handwriting';
import { HmacSHA512, enc } from 'crypto-js';

export default (Wrapped) => class extends Component {

	static propTypes = {
		strokes: PropTypes.array,
		onCircleDetected: PropTypes.func,
		useHandwritingRecognition: PropTypes.bool
	};

	static defaultProps = {
		strokes: [],
		onCircleDetected: () => {},
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

	xmlHttpRequest(callback) {
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', RECOGNITION_URL, true);
		xmlhttp.withCredentials = true;
		xmlhttp.setRequestHeader('Accept', 'application/json');
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
		xmlhttp.onreadystatechange = callback.bind(this, xmlhttp);
		return xmlhttp;
	}

	onReadyStateChange(request) {
		if (request.readyState == 4 && request.status == 200) {
			let answer = JSON.parse(request.responseText);
			let candidates = answer.result.textSegmentResult.candidates;
			this.setState({
				candidates: candidates
			});
			if (candidates[0] && candidates[0].label.toLowerCase() === 'o') {
				this.props.onCircleDetected();
			}
		}
	}

	hmacData(stringInput) {
		return encodeURIComponent(HmacSHA512(stringInput, APPLICATION_KEY + HMAC_KEY).toString(enc.Hex));
	}

	applicationKeyData() {
		return encodeURIComponent(APPLICATION_KEY);
	}

	stringInputData(stringInput) {
		return encodeURIComponent(stringInput);
	}

	recognize() {
		let stringInput = this.getStringInput(this.strokesToComponents(this.props.strokes));
		let data = `applicationKey=${this.applicationKeyData()}&textInput=${this.stringInputData(stringInput)}&hmac=${this.hmacData(stringInput)}`;
		this.xmlHttpRequest(this.onReadyStateChange.bind(this)).send(data);
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