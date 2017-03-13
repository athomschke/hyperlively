// @flow
import React, { Component, PropTypes } from 'react';
import JsonPropertyChooser from './JsonPropertyChooser';

export default class ParameterChooser extends Component {

	static propTypes = {
		onParameterChoose: PropTypes.func,
		lastStrokes: PropTypes.arrayOf(PropTypes.object),
		selectedStrokes: PropTypes.arrayOf(PropTypes.object),
		jsonTree: PropTypes.object,
	};

	static defaultProps = {
		onParameterChoose: () => {},
		lastStrokes: [],
		selectedStrokes: [],
		jsonTree: {},
	}

	constructor() {
		super();
		this.onParameterChoose = this.onParameterChoose.bind(this);
	}

	onParameterChoose(parameters: Array<Array<string>>) {
		this.props.onParameterChoose(parameters);
	}

	getParameterObject() {
		const rawData = Object.assign({}, this.props.jsonTree);
		if (this.props.lastStrokes.length > 0) {
			rawData.lastStrokes = this.props.lastStrokes;
		}
		if (this.props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = this.props.selectedStrokes;
		}
		return rawData;
	}

	render() {
		return (
			<JsonPropertyChooser
				{...this.props}
				jsonTree={this.getParameterObject()}
				onParameterChoose={this.onParameterChoose}
			/>);
	}

}
