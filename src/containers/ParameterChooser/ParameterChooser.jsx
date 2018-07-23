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
	) => getStrokesPosition(strokes.filter(stroke => shapeOrTextInterpretation.strokeIds.indexOf(stroke.id) >= 0));

	const renderShapeChoosers = () => props.interpretation.shapes.map((shapeResult, i) => (
		<PrefixedJSONPropertyChooser
			{...props}
			key={['interpretation', 'shapes', `${i}`, 'candidate'].join(PATH_DELIMITER)}
			prefixes={['interpretation', 'shapes', `${i}`, 'candidate']}
			jsonTree={jsonTree}
			position={getInterpretationPosition(shapeResult, props.strokes)}
		/>
	));

	const renderTextChoosers = () => props.interpretation.texts.map((textResult, i) => (
		<PrefixedJSONPropertyChooser
			{...props}
			key={['interpretation', 'texts', `${i}`, 'candidate'].join(PATH_DELIMITER)}
			prefixes={['interpretation', 'texts', `${i}`, 'candidate']}
			jsonTree={jsonTree}
			position={getInterpretationPosition(textResult, props.strokes)}
		/>
	));

	// todo: render multiple interpretation choosers
	return (
		<div style={{ display: 'inline' }}>
			{renderShapeChoosers()}
			{renderTextChoosers()}
			<PrefixedJSONPropertyChooser
				{...props}
				key="selectedStrokes"
				prefixes={['selectedStrokes']}
				jsonTree={jsonTree}
				position={getStrokesPosition(props.selectedStrokes) || undefined}
			/>
		</div>
	);
};
