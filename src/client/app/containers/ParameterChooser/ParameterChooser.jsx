// @flow
import React, { PureComponent } from 'react';

import type { Stroke, RecognitionResult, TreeParameter, JSONPath } from 'src/client/app/types';
import JsonPropertyChooser, { type JSONObject, type JsonPropertyChooserProps } from 'src/client/app/components/JsonPropertyChooser';

export type ParameterChooserProps = {
	onParameterChoose: (parameters: Array<TreeParameter>) => void,
	onCheckedPathsChange: (checkedPath: JSONPath) => void,
	onCollapsedPathsChange: (collapsedPath: JSONPath) => void,
	checkedPaths: JSONPath,
	collapsedPaths: JSONPath,
	lastStrokes: Array<Stroke>,
	selectedStrokes: Array<Stroke>,
	interpretations: RecognitionResult,
}

export default class ParameterChooser extends PureComponent<ParameterChooserProps> {
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

	props: ParameterChooserProps

	handleParameterChoose(parameters: Array<TreeParameter>) {
		this.props.onParameterChoose(parameters);
	}

	parameterObject(): JSONObject {
		const rawData: JSONObject = {
			...this.props.interpretations,
		};
		const lastStrokes = this.props.lastStrokes;
		if (lastStrokes.length > 0) {
			rawData.lastStrokes = lastStrokes;
		}
		if (this.props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = this.props.selectedStrokes;
		}
		return rawData;
	}

	render() {
		const jsonObject = (this.parameterObject():JSONObject);
		const propChooserProps: JsonPropertyChooserProps = {
			jsonTree: jsonObject,
			checkedPaths: this.props.checkedPaths,
			collapsedPaths: this.props.collapsedPaths,
			onCheckedPathsChange: this.props.onCheckedPathsChange,
			onCollapsedPathsChange: this.props.onCollapsedPathsChange,
			onParameterChoose: this.handleParameterChoose,
		};

		return (
			<JsonPropertyChooser {...propChooserProps} />);
	}
}
