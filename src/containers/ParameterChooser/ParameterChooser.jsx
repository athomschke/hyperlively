// @flow
/* eslint-disable react/prop-types */
import * as React from 'react';

import type {
	Stroke, RecognitionState, Coordinate, ShapeCandidateState, TreeParameter,
} from 'src/types';
import { type JSONObject } from 'src/components/JsonPropertyChooser';

import PrefixedJSONPropertyChooser from './PrefixedJSONPropertyChooser';

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

	// todo: render multiple interpretation choosers
	return (
		<div style={{ display: 'inline' }}>
			<PrefixedJSONPropertyChooser
				{...props}
				prefix="interpretation"
				jsonTree={jsonTree}
				position={getInterpretationPosition(interpretation) || undefined}
			/>
			<PrefixedJSONPropertyChooser
				{...props}
				prefix="selectedStrokes"
				jsonTree={jsonTree}
				position={getStrokesPosition(props.selectedStrokes) || undefined}
			/>
		</div>
	);
};
