// @flow
/* eslint-disable react/prop-types */
import * as React from 'react';

import type {
	Stroke, RecognitionState, TreeParameter, Coordinate, ShapeCandidateState,
} from 'src/types';
import { PATH_DELIMITER } from 'src/constants/configuration';
import JsonPropertyChooser, { type JSONObject } from 'src/components/JsonPropertyChooser';

export type ParameterChooserStateProps = {
	checkedPaths: Array<string>,
	expandedPaths: Array<string>,
	interpretation: RecognitionState,
}

export type ParameterChooserDispatchProps = {
	onParameterChoose: (parameters: Array<TreeParameter>) => void,
	onCheckedPathsChange: (checkedPath: Array<string>) => void,
	onExpandedPathsChange: (collapsedPath: Array<string>) => void,
}

export type ParameterChooserProps = ParameterChooserStateProps & ParameterChooserDispatchProps & {
	lastStrokes: Array<Stroke>,
	selectedStrokes: Array<Stroke>,
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
	onExpandedPathsChange: () => {},
	checkedPaths: [],
	expandedPaths: [],
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
		const combinePaths = (upperPaths: Array<string>, lowerPaths: Array<string>): Array<string> => [
			...upperPaths.filter(path => path.split(PATH_DELIMITER)[0] !== prefix),
			...lowerPaths.map(path => [prefix, ...path.split(PATH_DELIMITER)].join(PATH_DELIMITER)),
		];
		const filterPaths = (paths: Array<string>): Array<string> => paths.filter(
			path => path.split(PATH_DELIMITER)[0] === prefix,
		).map(
			path => path.split(PATH_DELIMITER).slice(1).join(PATH_DELIMITER),
		);

		return (
			<JsonPropertyChooser
				position={position}
				jsonTree={jsonTree[prefix]}
				checkedPaths={filterPaths(props.checkedPaths)}
				expandedPaths={filterPaths(props.expandedPaths)}
				onParameterChoose={props.onParameterChoose}
				onCheckedPathsChange={paths => props.onCheckedPathsChange(combinePaths(props.checkedPaths, paths))}
				onExpandedPathsChange={paths => props.onExpandedPathsChange(combinePaths(props.expandedPaths, paths))}
			/>
		);
	};

	const coordinateFromShapeResult = (shapeResult: ShapeCandidateState) => {
		if (shapeResult.primitives) {
			const center: Coordinate = (shapeResult.candidate.primitives[0]: any).center;
			const firstPoint: Coordinate = (shapeResult.candidate.primitives[0]: any).firstPoint;
			return center || firstPoint;
		}
		return null;
	};

	const getInterpretationPosition = (shapeOrTextInterpretation: RecognitionState) => {
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
	return (
		<div style={{ display: 'inline' }}>
			{renderPrefixedChooser('interpretation', getInterpretationPosition(interpretation) || undefined)}
			{renderPrefixedChooser('selectedStrokes', getStrokesPosition(props.selectedStrokes) || undefined)}
		</div>
	);
};
