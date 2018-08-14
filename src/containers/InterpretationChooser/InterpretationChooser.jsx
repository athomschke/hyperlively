// @flow
import * as React from 'react';

import type {
	Stroke, RecognitionState, Parameters, Coordinate, Sketch,
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
	selectedParameters: Parameters,
}

export type InterpretationChooserDispatchProps = {
	onParameterChoose: (parameters: Parameters) => void,
}

export type InterpretationChooserProps = InterpretationChooserStateProps & InterpretationChooserDispatchProps & {
	selectedStrokes: Array<Stroke>,
	sketches: Array<Sketch>,
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

const parameterObject = (interpretation, selectedStrokes, sketches): JSONObject => {
	const rawData: JSONObject = { interpretation, sketches };
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
	const { selectedParameters } = props;
	const jsonTree = (parameterObject(props.interpretation, props.selectedStrokes, props.sketches):JSONObject);

	const handleOnParameterChoose = (parameters: Array<string>): void => {
		const valueAtPath = (obj: Object, path: string) => path.split(PATH_DELIMITER).reduce((subtree, key) => subtree[key], obj);
		const leafes = parameters.map(checkedKey => ({ value: valueAtPath(jsonTree, checkedKey), path: checkedKey.split(PATH_DELIMITER) }));
		const values: Parameters = leafes.map(
			(leaf: { value: any, path: string[] }) => {
				if (leaf.value instanceof Object) return leaf;
				if (Number.isNaN(parseInt(leaf.value, 10))) return { value: leaf.toString(), path: leaf.path };
				return { value: parseInt(leaf.value, 10), path: leaf.path };
			},
		);
		props.onParameterChoose([...selectedParameters, ...values]);
	};

	const getChooserProps = (key, prefixes, position) => ({
		key,
		prefixes,
		position,
	});

	const getInterpretationsChoosersProps = (interpretations: Array<any>, prefixes) => interpretations.map(
		(interpretation, i): ?PartialPrefixedJSONPropertyChooserProps => {
			const strokesAreSelected = props.selectedStrokes.find(
				selectedStroke => interpretation.strokeIds.indexOf(selectedStroke.id) >= 0,
			);
			return strokesAreSelected && getChooserProps(
				[...prefixes, `${i}`].join(PATH_DELIMITER),
				[...prefixes, `${i}`],
				getStrokesPosition(props.strokes.filter(stroke => interpretation.strokeIds.indexOf(stroke.id) >= 0)),
			);
		},
	).filter(Boolean).filter(interpretationChooserProps => interpretationChooserProps);

	const getShapeChoosersProps = (): Array<PartialPrefixedJSONPropertyChooserProps> => getInterpretationsChoosersProps(
		props.interpretation.shapes,
		['interpretation', 'shapes'],
	);

	const getTextChoosersProps = (): Array<PartialPrefixedJSONPropertyChooserProps> => getInterpretationsChoosersProps(
		props.interpretation.texts,
		['interpretation', 'texts'],
	);

	const getSketchChooserProps = () => props.sketches.map(
		(sketch, i) => (sketch.strokes.reduce((allVisible, stroke) => stroke.selected, true) ? {
			key: 'sketches',
			prefixes: ['sketches', `${i}`],
			position: getStrokesPosition(sketch.strokes),
		} : undefined),
	).filter(Boolean).filter(chooserProps => chooserProps);

	const getSelectedStrokesChoosersProps = () => (props.selectedStrokes.length > 0 ? [
		getChooserProps('selectedStrokes', ['selectedStrokes'], getStrokesPosition(props.selectedStrokes)),
	] : []);

	const groupedChoosersProps = groupChoosersProps([
		...getSelectedStrokesChoosersProps(),
		...getSketchChooserProps(),
		...getShapeChoosersProps(),
		...getTextChoosersProps(),
	]);

	const groupChoosersPropsbyType = choosersProps => choosersProps.reduce((accumulator, chooserProps) => ({
		...accumulator,
		[chooserProps.prefixes[0]]: [...(accumulator[chooserProps.prefixes[0]] || []), chooserProps],
	}), {});

	const renderPostitionParameterChoosersGroup = (choosersProps, recognizedLabel) => {
		const typeGroups = groupChoosersPropsbyType(choosersProps);
		return Object.keys(typeGroups).map(typeKey => (
			<ParameterChooser
				recognizedLabel={recognizedLabel}
				key={typeKey}
				choosersProps={typeGroups[typeKey]}
				jsonTree={jsonTree}
				onParameterChoose={handleOnParameterChoose}
			/>
		));
	};

	const renderChooserGroupAt = (groupKey, choosersProps, position) => {
		const recognizedLabel = choosersProps
			.filter(choosersProp => choosersProp.key.startsWith('interpretation'))
			.map(
				choosersProp => choosersProp.prefixes.reduce(
					(value, prefix) => value[prefix],
					jsonTree,
				).candidate.label,
			)
			.filter(Boolean)[0];

		return (
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
				<ActionChooser recognizedLabel={recognizedLabel} />
				{renderPostitionParameterChoosersGroup(choosersProps, recognizedLabel)}
			</div>
		);
	};

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
