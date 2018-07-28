// @flow
/* eslint-disable react/prop-types */
import * as React from 'react';

import type {
	Stroke, RecognitionState, ShapeCandidateState, TreeParameter, TextCandidateState,
} from 'src/types';
import { type JSONObject } from 'src/components/JsonPropertyChooser';
import { PATH_DELIMITER } from 'src/constants/configuration';

import PrefixedJSONPropertyChooser from './PrefixedJSONPropertyChooser';

export type ParameterChooserStateProps = {
	strokes: Array<Stroke>,
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
	strokes: [],
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

const hashPosition = coordinate => (coordinate ? `(${coordinate.x}, ${coordinate.y})` : 'undefined');

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

	const getInterpretationPosition = (
		shapeOrTextInterpretation: TextCandidateState | ShapeCandidateState, strokes,
	) => {
		const overlappingPosition = getStrokesPosition(
			strokes.filter(stroke => shapeOrTextInterpretation.strokeIds.indexOf(stroke.id) >= 0),
		);
		return overlappingPosition;
	};

	const getShapeChoosersProps = () => props.interpretation.shapes.map((shapeResult, i) => ({
		...props,
		key: ['interpretation', 'shapes', `${i}`].join(PATH_DELIMITER),
		prefixes: ['interpretation', 'shapes', `${i}`],
		jsonTree,
		position: getInterpretationPosition(shapeResult, props.strokes),
	}));

	const getTextChooserProps = () => props.interpretation.texts.map((textResult, i) => ({
		...props,
		key: ['interpretation', 'texts', `${i}`].join(PATH_DELIMITER),
		prefixes: ['interpretation', 'texts', `${i}`],
		jsonTree,
		position: getInterpretationPosition(textResult, props.strokes),
	}));

	const getSelectedStrokesChoosersProps = () => {
		if (props.selectedStrokes.length > 0) {
			return [{
				...props,
				key: 'selectedStrokes',
				prefixes: ['selectedStrokes'],
				jsonTree,
				position: getStrokesPosition(props.selectedStrokes) || undefined,
			}];
		}
		return [];
	};

	const choosersProps = [
		...getShapeChoosersProps(),
		...getTextChooserProps(),
		...getSelectedStrokesChoosersProps(),
	];

	const groupedChoosersProps = choosersProps.reduce((groupedResult, chooserProps) => {
		const hashedPosition = hashPosition(chooserProps.position);
		return {
			...groupedResult,
			[hashedPosition]: [
				...(groupedResult[hashedPosition] || []),
				chooserProps,
			],
		};
	}, {});

	return (
		<div style={{ display: 'inline' }}>
			{Object.keys(groupedChoosersProps).map(groupKey => (
				<div
					style={{
						position: 'absolute',
						left: groupedChoosersProps[groupKey][0].position.x,
						top: groupedChoosersProps[groupKey][0].position.y,
					}}
				>
					{groupedChoosersProps[groupKey].map(chooserProps => <PrefixedJSONPropertyChooser {...chooserProps} position={null} />)}
				</div>
			))}
		</div>
	);
};
