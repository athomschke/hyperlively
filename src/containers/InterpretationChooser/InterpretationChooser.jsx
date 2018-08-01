// @flow
import * as React from 'react';

import type {
	Stroke, RecognitionState, TreeParameter, Coordinate,
} from 'src/types';
import { type JSONObject } from 'src/components/JsonPropertyChooser';
import { PATH_DELIMITER } from 'src/constants/configuration';
import InterpretationTrigger from 'src/containers/InterpretationTrigger';
import ActionChooser from 'src/containers/ActionChooser';
import InterpretationDisplay from 'src/containers/InterpretationDisplay';
import ParameterChooser from 'src/containers/ParameterChooser';

export type InterpretationChooserStateProps = {
	strokes: Array<Stroke>,
	interpretation: RecognitionState,
}

export type InterpretationChooserDispatchProps = {
	onParameterChoose: (parameters: Array<TreeParameter>) => void,
}

export type InterpretationChooserProps = InterpretationChooserStateProps & InterpretationChooserDispatchProps & {
	selectedStrokes: Array<Stroke>,
}

type PartialPrefixedJSONPropertyChooserProps = {
	position: ?Coordinate,
	key: string,
	prefixes: Array<string>,
}

const hashPosition = coordinate => (coordinate ? `(${coordinate.x}, ${coordinate.y})` : 'undefined');

const getStrokesPosition = (strokes: Array<Stroke>): ?Coordinate => {
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
	return undefined;
};

const parameterObject = (interpretation, selectedStrokes): JSONObject => {
	const rawData: JSONObject = { interpretation };
	if (selectedStrokes.length > 0) {
		rawData.selectedStrokes = selectedStrokes;
	}
	return rawData;
};

const groupChoosersProps = ungroupedChoosersProps => ungroupedChoosersProps.reduce((groupedResult, chooserProps) => {
	const hashedPosition = hashPosition(chooserProps.position);
	return {
		...groupedResult,
		[hashedPosition]: [
			...(groupedResult[hashedPosition] || []),
			chooserProps,
		],
	};
}, {});

const InterpretationChooser = (props: InterpretationChooserProps) => {
	const jsonTree = (parameterObject(props.interpretation, props.selectedStrokes):JSONObject);

	const handleOnParameterChoose = (parameters: Array<string>): void => {
		const valueAtPath = (obj: Object, path: string) => path.split(PATH_DELIMITER).reduce((subtree, key) => subtree[key], obj);
		const leafes = parameters.map(checkedKey => valueAtPath(jsonTree, checkedKey));
		const values: Array<TreeParameter> = leafes.map(
			leaf => (Number.isNaN(parseInt(leaf, 10)) ? leaf.toString() : Number.parseInt(leaf.toString(), 10)),
		);
		props.onParameterChoose(values);
	};

	const getChooserProps = (key, prefixes, position) => ({
		key,
		prefixes,
		position,
	});

	const getShapeChoosersProps = (): Array<PartialPrefixedJSONPropertyChooserProps> => props.interpretation.shapes
		.map((shapeResult, i): ?PartialPrefixedJSONPropertyChooserProps => {
			const strokesAreSelected = props.selectedStrokes.find(selectedStroke => shapeResult.strokeIds.indexOf(selectedStroke.id) >= 0);
			return strokesAreSelected && getChooserProps(
				['interpretation', 'shapes', `${i}`].join(PATH_DELIMITER),
				['interpretation', 'shapes', `${i}`],
				getStrokesPosition(props.strokes.filter(stroke => shapeResult.strokeIds.indexOf(stroke.id) >= 0)),
			);
		})
		.filter(Boolean)
		.filter(shapeChooserProps => shapeChooserProps);

	const getTextChooserProps = (): Array<PartialPrefixedJSONPropertyChooserProps> => props.interpretation.texts
		.map((textResult, i): ?PartialPrefixedJSONPropertyChooserProps => {
			const strokesAreSelected = props.selectedStrokes.find(selectedStroke => textResult.strokeIds.indexOf(selectedStroke.id) >= 0);
			return strokesAreSelected && getChooserProps(
				['interpretation', 'texts', `${i}`].join(PATH_DELIMITER),
				['interpretation', 'texts', `${i}`],
				getStrokesPosition(props.strokes.filter(stroke => textResult.strokeIds.indexOf(stroke.id) >= 0)),
			);
		})
		.filter(Boolean)
		.filter(shapeChooserProps => shapeChooserProps);

	const getSelectedStrokesChoosersProps = () => (props.selectedStrokes.length > 0 ? [
		getChooserProps('selectedStrokes', ['selectedStrokes'], getStrokesPosition(props.selectedStrokes)),
	] : []);

	const groupedChoosersProps = groupChoosersProps([
		...getSelectedStrokesChoosersProps(),
		...getShapeChoosersProps(),
		...getTextChooserProps(),
	]);

	const renderChooserGroupAt = (groupKey, choosersProps, position) => (
		<div
			key={groupKey}
			style={{
				position: 'absolute',
				left: position.x,
				top: position.y,
			}}
		>
			<InterpretationTrigger />
			<InterpretationDisplay />
			<ActionChooser />
			{choosersProps.map(chooserProps => (
				<ParameterChooser
					key={chooserProps.key}
					prefixes={chooserProps.prefixes}
					onParameterChoose={handleOnParameterChoose}
					jsonTree={jsonTree}
				/>
			))}
		</div>
	);

	return (
		<div style={{ display: 'inline' }}>
			{
				Object.keys(groupedChoosersProps).map((groupKey) => {
					const position = groupedChoosersProps[groupKey][0].position;
					const choosersProps = groupedChoosersProps[groupKey].map(chooserProps => ({
						key: chooserProps.key,
						prefixes: chooserProps.prefixes,
					}));

					return renderChooserGroupAt(groupKey, choosersProps, position);
				})
			}
		</div>
	);
};

export default InterpretationChooser;
