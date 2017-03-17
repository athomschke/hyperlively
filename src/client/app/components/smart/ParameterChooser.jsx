// @flow
import React, { PureComponent } from 'react';
import JsonPropertyChooser from './JsonPropertyChooser';
import { type Stroke, type RecognitionResult } from '../../typeDefinitions';

type Props = {
	onParameterChoose: (parameters: Array<Array<string>>) => void,
	lastStrokes: Array<Stroke>,
	selectedStrokes: Array<Stroke>,
	interpretations: RecognitionResult,
}

export default class ParameterChooser extends PureComponent {

	static defaultProps = {
		onParameterChoose: () => {},
		lastStrokes: [],
		selectedStrokes: [],
		interpretations: {},
	}

	constructor() {
		super();
		this.handleParameterChoose = this.handleParameterChoose.bind(this);
	}

	props: Props

	handleParameterChoose(parameters: Array<Array<string>>) {
		this.props.onParameterChoose(parameters);
	}

	parameterObject() {
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
				jsonTree={this.parameterObject()}
				onParameterChoose={this.handleParameterChoose}
			/>);
	}

}
