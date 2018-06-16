// @flow

import type { HyperlivelyState } from 'src/client/app/typeDefinitions';

const canvasWithIrregularStrokesWithPloma = (): HyperlivelyState => ({
	interpretation: {
		showInterpreter: true,
		interpretations: {
			texts: [],
			shapes: [],
		},
	},
	observeMutations: true,
	drawing: false,
	specificActions: [],
	ploma: {
		usePloma: true,
		uniqueCanvasFactor: 0.315,
	},
	handwritingRecognition: false,
	threshold: 500,
	content: {
		sceneIndex: 0,
		undoableScenes: {
			past: [],
			future: [],
			present: [{
				strokes: [{
					hidden: false,
					selected: false,
					finished: true,
					points: [
						{ x: 10, y: 10, timeStamp: 100 },
						{ x: 11, y: 15, timeStamp: 101 },
						{ x: 13, y: 14, timeStamp: 102 },
						{ x: 13, y: 16, timeStamp: 103 },
						{ x: 12, y: 19, timeStamp: 104 },
						{ x: 11, y: 21, timeStamp: 105 },
					],
				}, {
					hidden: false,
					selected: false,
					finished: true,
					points: [
						{ x: 30, y: 10, timeStamp: 1106 },
						{ x: 31, y: 15, timeStamp: 1107 },
						{ x: 33, y: 14, timeStamp: 1108 },
						{ x: 33, y: 16, timeStamp: 1109 },
						{ x: 32, y: 19, timeStamp: 1110 },
						{ x: 31, y: 21, timeStamp: 1120 },
					],
				}],
			}],
		},
	},
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
});

export default canvasWithIrregularStrokesWithPloma;
