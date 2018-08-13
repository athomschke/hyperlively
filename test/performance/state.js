// @flow
import { last, cloneDeep } from 'lodash';

import { stroke } from 'src/reducers/data/strokes/stroke';
import type {
	Scenes, Stroke, Data, Undoable, HyperlivelyState, StrokeReference,
} from 'src/types';

const NUMBER_OF_STROKES = 1;
const LENGTH_OF_STROKE = 3;

export const createUndoableScenes = (numberOfStrokes: number, lengthOfStroke: number): Array<Scenes> => {
	const pastScenes: Array<Scenes> = [];
	const currentStrokes: Array<StrokeReference> = [];
	for (let id = 0; id < numberOfStrokes; id += 1) {
		currentStrokes.push({ id, length: 0 });
		pastScenes.push(
			[{ strokes: cloneDeep(currentStrokes) }],
		);
		for (let length = 0; length < lengthOfStroke; length += 1) {
			last(currentStrokes).length = length;
			pastScenes.push(
				[{ strokes: cloneDeep(currentStrokes) }],
			);
		}
	}
	return pastScenes;
};

export const createStrokes = (numberOfStrokes: number, lengthOfStroke: number): Array<Stroke> => {
	let timeStamp = new Date().getTime();
	const strokes = [];
	for (let id = 0; id < numberOfStrokes; id += 1) {
		const currentStroke = stroke(undefined, { type: '' });
		for (let length = 0; length < lengthOfStroke; length += 1) {
			currentStroke.points.push({
				x: 10 + id,
				y: 10 + length,
				timeStamp,
			});
			timeStamp += 1;
		}
		strokes.push(currentStroke);
		timeStamp += 100;
	}
	return strokes;
};

const allScenes = createUndoableScenes(NUMBER_OF_STROKES, LENGTH_OF_STROKE);

const past: Array<Scenes> = allScenes.slice(0, allScenes.length - 1);

const present: Scenes = last(allScenes);

const scenes: Undoable<Scenes> = {
	past,
	present,
	future: [],
};

const strokes: Array<Stroke> = createStrokes(NUMBER_OF_STROKES, LENGTH_OF_STROKE);

const data: Data = {
	specificActions: [],
	sceneIndex: 0,
	interpretation: {
		shapes: [],
		texts: [],
	},
	strokes,
	scenes,
};

export const hyperlivelyState: HyperlivelyState = {
	interpretation: {
		showInterpreter: false,
		interpretations: {
			shapes: [],
			texts: [],
		},
	},
	data,
	ui: {
		showInterpreter: true,
		threshold: 50,
		ploma: {
			uniqueCanvasFactor: 35,
			usePloma: true,
		},
		observeMutations: false,
		handwritingRecognition: false,
		drawing: false,
		actions: {
			checkedPath: [],
			expandedPath: [],
		},
		parameters: {
			checkedPath: [],
			expandedPath: [],
		},
		interpretations: {
			functions: [],
			parameters: [],
			stored: {},
		},
	},
};
