// @flow
/* eslint-disable react/prop-types */
import * as React from 'react';

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

const defaultProps = (): ParameterChooserProps => ({
	onParameterChoose: () => {},
	lastStrokes: [],
	selectedStrokes: [],
	interpretations: {
		texts: [],
		shapes: [],
	},
	onCheckedPathsChange: () => {},
	onCollapsedPathsChange: () => {},
	checkedPaths: [],
	collapsedPaths: [],
});

export default (props: ParameterChooserProps = defaultProps()) => {
	const onParameterChoose = (parameters: Array<TreeParameter>) => {
		props.onParameterChoose(parameters);
	};

	const parameterObject = (): JSONObject => {
		const rawData: JSONObject = {
			...props.interpretations,
		};
		const lastStrokes = props.lastStrokes;
		if (lastStrokes.length > 0) {
			rawData.lastStrokes = lastStrokes;
		}
		if (props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = props.selectedStrokes;
		}
		return rawData;
	};

	const jsonTree = (parameterObject():JSONObject);
	const propChooserProps: JsonPropertyChooserProps = {
		jsonTree,
		onParameterChoose,
		checkedPaths: props.checkedPaths,
		collapsedPaths: props.collapsedPaths,
		onCheckedPathsChange: props.onCheckedPathsChange,
		onCollapsedPathsChange: props.onCollapsedPathsChange,
	};

	return (<JsonPropertyChooser {...propChooserProps} />);
};
