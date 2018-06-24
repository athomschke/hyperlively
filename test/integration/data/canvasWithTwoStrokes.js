// @flow

import type { HyperlivelyState } from 'src/client/app/typeDefinitions';

const canvasWithTwoStrokes = (): HyperlivelyState => ({
	specificActions: [],
	data: {
		sceneIndex: 0,
		interpretation: {
			showInterpreter: true,
			interpretations: {
				shapes: [],
				texts: [],
			},
		},
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
		threshold: 500,
		ploma: {
			usePloma: false,
			uniqueCanvasFactor: NaN,
		},
		observeMutations: true,
		handwritingRecognition:	false,
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
