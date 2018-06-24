// @flow

import type { HyperlivelyState } from 'src/client/app/typeDefinitions';

const canvasWithTwoStrokes = (): HyperlivelyState => ({
	ploma: {
		usePloma: false,
		uniqueCanvasFactor: NaN,
	},
	specificActions: [],
	threshold: 500,
	handwritingRecognition:	false,
	interpretation: {
		showInterpreter: true,
		interpretations: {
			texts: [],
			shapes: [],
		},
	},
	observeMutations: true,
	data: {
		sceneIndex: 0,
		undoableScenes: {
			past: [],
			present: [{
				strokes: [{
					finished: true,
					hidden: false,
					selected: false,
					points: [
						{ x: 10, y: 10, timeStamp: 100 },
						{ x: 10, y: 30, timeStamp: 101 },
					],
				}, {
					finished: true,
					hidden: false,
					selected: false,
					points: [
						{ x: 20, y: 10, timeStamp: 1100 },
						{ x: 20, y: 30, timeStamp: 1101 },
					],
				}],
			}],
			future: [],
		},
	},
	ui: {
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
});

export default canvasWithTwoStrokes;
