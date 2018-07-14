// @flow
import { last, cloneDeep } from 'lodash';

import { stroke } from 'src/reducers/data/strokes/stroke';
import type { Scene, Scenes, Stroke, Data, Undoable, HyperlivelyState } from 'src/types';

const dummyStroke: Stroke = stroke(undefined, { type: '' });

const createUndoableScenes = (numberOfStrokes: number, lengthOfStroke: number): Scenes => {
	const allScenes: Array<Scene> = [];
	const sceneInProgress: Scene = {
		strokes: [],
	};
	let time = new Date().getTime();
	for (let i = 0; i < numberOfStrokes; i += 1) {
		const strokeInProgress: Stroke = Object.assign({}, dummyStroke);
		time += 100;
		for (let j = 0; j < lengthOfStroke; j += 1) {
			strokeInProgress.points.push({
				x: 10 + j,
				y: 10 + i,
				timeStamp: time,
			});
			if (j === lengthOfStroke - 1) { // last stroke
				strokeInProgress.finished = true;
			}
			if (j === 0) { // first stroke
				sceneInProgress.strokes.push(strokeInProgress);
			}
			allScenes.push(Object.assign({}, cloneDeep(sceneInProgress)));
			time += 1;
		}
	}
	return allScenes;
};

const sceneState: Scenes = createUndoableScenes(1, 3);

const past: Array<Scenes> = [sceneState.slice(0, sceneState.length - 1)];

const present: Scenes = [last(sceneState)];

const scenes: Undoable<Scenes> = {
	past,
	present,
	future: [],
};

const data: Data = {
	specificActions: [],
	sceneIndex: 0,
	interpretation: {
		shapes: [],
		texts: [],
	},
	scenes,
};

const hyperlivelyState: HyperlivelyState = {
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
			collapsedPath: [],
		},
		parameters: {
			checkedPath: [],
			collapsedPath: [],
		},
		interpretations: {
			functions: [],
			parameters: [],
		},
	},
};

export { sceneState, hyperlivelyState, createUndoableScenes };
