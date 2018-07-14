// @flow
/* eslint-disable react/prop-types */
import * as React from 'react';

import type { Stroke, RecognitionResult, TreeParameter, JSONPath, Coordinate, ShapeCandidate } from 'src/types';
import JsonPropertyChooser, { type JSONObject } from 'src/components/JsonPropertyChooser';

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

	const renderPrefixedChooser = (prefix: string, position?: Coordinate) => {
		const combinePaths = (upperPaths, lowerPaths) => [
			...upperPaths.filter(path => path[0] !== prefix),
			...lowerPaths.map(path => [prefix, ...path]),
		];
		const filterPaths = paths => paths.filter(path => path[0] === prefix).map(ea => ea.slice(1));

		return (<JsonPropertyChooser
			position={position}
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

	const coordinateFromShapeResult = (shapeResult: ShapeCandidate) => {
		if (shapeResult.primitives) {
			const center: Coordinate = (shapeResult.primitives[0]: any).center;
			const firstPoint: Coordinate = (shapeResult.primitives[0]: any).firstPoint;
			return center || firstPoint;
		}
		return null;
	};

	const getInterpretationPosition = (shapeOrTextInterpretation: RecognitionResult) => {
		const shapePositions: Array<Coordinate | null> = shapeOrTextInterpretation.shapes
			.map(coordinateFromShapeResult)
			.filter(position => !!position);
		return shapePositions[0];
	};

	const getStrokesPosition = (strokes: Array<Stroke>) => {
		const allPoints = strokes.reduce((points, stroke) => [...points, ...stroke.points], []);
		if (allPoints.length > 0) {
			const xs = allPoints.map(point => point.x);
			const ys = allPoints.map(point => point.y);
			const minX = Math.min(...xs);
			const maxX = Math.max(...xs);
			const minY = Math.min(...ys);
			const maxY = Math.max(...ys);
			return { x: minX + ((maxX - minX) / 2), y: minY + ((maxY - minY) / 2) };
		}
		return null;
	};

	// todo: render multiple interpretation chooser
	return (<div style={{ display: 'inline' }}>
		{renderPrefixedChooser('interpretation', getInterpretationPosition(interpretation) || undefined)}
		{renderPrefixedChooser('selectedStrokes', getStrokesPosition(props.selectedStrokes) || undefined)}
	</div>);
};
