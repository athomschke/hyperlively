// @flow
import React, { PureComponent } from 'react';
import JsonPropertyChooser from './JsonPropertyChooser';
import type { Stroke, RecognitionResult, TreeParameter } from 'typeDefinitions';

type Props = {
	onParameterChoose: (parameters: Array<TreeParameter>) => void,
	lastStrokes: Array<Stroke>,
	selectedStrokes: Array<Stroke>,
	interpretations: RecognitionResult,
}

export default class ParameterChooser extends PureComponent<Props> {

	static defaultProps = {
		onParameterChoose: () => {},
		lastStrokes: [],
		selectedStrokes: [],
		interpretations: {},
	}

	constructor() {
		super();
		(this:any).handleParameterChoose = this.handleParameterChoose.bind(this);
	}

	props: Props

	handleParameterChoose(parameters: Array<TreeParameter>) {
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
