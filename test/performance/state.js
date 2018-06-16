// @flow
import { last, cloneDeep } from 'lodash';

import { DEFAULT_PEN_COLOR } from 'src/client/app/constants/drawing';
import type { Scene, SceneState, Stroke, Content, UndoableScenes, HyperlivelyState } from 'src/client/app/typeDefinitions';

const dummyStroke: Stroke = {
	points: [],
	finished: false,
	color: DEFAULT_PEN_COLOR,
	hidden: false,
	selected: false,
};

const createUndoableScenes = (numberOfStrokes: number, lengthOfStroke: number): SceneState => {
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

const sceneState: SceneState = createUndoableScenes(1, 3);

const past: Array<SceneState> = [sceneState.slice(0, sceneState.length - 1)];

const present: SceneState = [last(sceneState)];

const undoableScenes: UndoableScenes = {
	past,
	present,
	future: [],
};

const content: Content = {
	sceneIndex: 0,
	undoableScenes,
};

const hyperlivelyState: HyperlivelyState = {
	ploma: {
		uniqueCanvasFactor: 35,
		usePloma: true,
	},
	specificActions: [],
	interpretation: {
		showInterpreter: false,
		interpretations: {
			shapes: [],
			texts: [],
		},
	},
	handwritingRecognition: false,
	observeMutations: false,
	threshold: 50,
	drawing: false,
	content,
	ui: {
		actions: {
			checkedPath: [],
			collapsedPath: [],
		},
		parameters: {
			checkedPath: [],
			collapsedPath: [],
		},
	},
};

export { sceneState, hyperlivelyState, createUndoableScenes };
