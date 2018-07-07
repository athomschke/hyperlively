// @flow
/* eslint-disable react/prop-types */
import * as React from 'react';

import type { Stroke, RecognitionResult, TreeParameter, JSONPath } from 'src/client/app/types';
import JsonPropertyChooser, { type JSONObject } from 'src/client/app/components/JsonPropertyChooser';

export type ParameterChooserProps = {
	onParameterChoose: (parameters: Array<TreeParameter>) => void,
	onCheckedPathsChange: (checkedPath: JSONPath) => void,
	onCollapsedPathsChange: (collapsedPath: JSONPath) => void,
	checkedPaths: JSONPath,
	collapsedPaths: JSONPath,
	lastStrokes: Array<Stroke>,
	selectedStrokes: Array<Stroke>,
	interpretation: RecognitionResult,
}

const defaultProps = (): ParameterChooserProps => ({
	onParameterChoose: () => {},
	lastStrokes: [],
	selectedStrokes: [],
	interpretation: {
		texts: [],
		shapes: [],
	},
	onCheckedPathsChange: () => {},
	onCollapsedPathsChange: () => {},
	checkedPaths: [],
	collapsedPaths: [],
});

export default (props: ParameterChooserProps = defaultProps()) => {
	const { interpretation } = props;
	const parameterObject = (): JSONObject => {
		const rawData: JSONObject = { interpretation };
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

	const renderPrefixedChooser = (prefix: string) => {
		const combinePaths = (upperPaths, lowerPaths) => [
			...upperPaths.filter(path => path[0] !== prefix),
			...lowerPaths.map(path => [prefix, ...path]),
		];
		const filterPaths = paths => paths.filter(path => path[0] === prefix).map(ea => ea.slice(1));

		return (<JsonPropertyChooser
			jsonTree={jsonTree[prefix]}
			checkedPaths={filterPaths(props.checkedPaths)}
			collapsedPaths={filterPaths(props.collapsedPaths)}
			onParameterChoose={props.onParameterChoose}
			onCheckedPathsChange={
				(paths: JSONPath) => {
					props.onCheckedPathsChange(combinePaths(props.checkedPaths, paths));
				}
			}
			onCollapsedPathsChange={
				(paths: JSONPath) => {
					props.onCollapsedPathsChange(combinePaths(props.collapsedPaths, paths));
				}
			}
		/>);
	};

	return (<div style={{ display: 'inline' }}>
		{renderPrefixedChooser('lastStrokes')}
		{renderPrefixedChooser('interpretation')}
		{renderPrefixedChooser('selectedStrokes')}
	</div>);
};
