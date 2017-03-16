// @flow
import React, { PureComponent, PropTypes } from 'react';
import JsonPropertyChooser from './JsonPropertyChooser';

export default class ParameterChooser extends PureComponent {

	static propTypes = {
		onParameterChoose: PropTypes.func,
		lastStrokes: PropTypes.arrayOf(PropTypes.object),
		selectedStrokes: PropTypes.arrayOf(PropTypes.object),
		interpretations: PropTypes.object,
	};

	static defaultProps = {
		onParameterChoose: () => {},
		lastStrokes: [],
		selectedStrokes: [],
		interpretations: {},
	}

	constructor() {
		super();
		this.onParameterChoose = this.onParameterChoose.bind(this);
	}

	onParameterChoose(parameters: Array<Array<string>>) {
		this.props.onParameterChoose(parameters);
	}

	getParameterObject() {
		const rawData = Object.assign({}, this.props.interpretations);
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
