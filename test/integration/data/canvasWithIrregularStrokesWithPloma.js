// @flow

import type { HyperlivelyState } from 'src/types';

const canvasWithIrregularStrokesWithPloma = (): HyperlivelyState => ({
	data: {
		specificActions: [],
		sceneIndex: 0,
		interpretation: {
			texts: [],
			shapes: [],
		},
		scenes: {
			past: [],
			future: [],
			present: [{
				strokes: [{
					id: 1,
					hidden: false,
					selected: false,
					finished: true,
					angle: 0,
					center: {
						x: 0,
						y: 0,
					},
					points: [
						{ x: 10, y: 10, timeStamp: 100 },
						{ x: 11, y: 15, timeStamp: 101 },
						{ x: 13, y: 14, timeStamp: 102 },
						{ x: 13, y: 16, timeStamp: 103 },
						{ x: 12, y: 19, timeStamp: 104 },
						{ x: 11, y: 21, timeStamp: 105 },
					],
					position: {
						x: 0,
						y: 0,
					},
				}, {
					id: 2,
					hidden: false,
					selected: false,
					finished: true,
					angle: 0,
					center: {
						x: 0,
						y: 0,
					},
					points: [
						{ x: 30, y: 10, timeStamp: 1106 },
						{ x: 31, y: 15, timeStamp: 1107 },
						{ x: 33, y: 14, timeStamp: 1108 },
						{ x: 33, y: 16, timeStamp: 1109 },
						{ x: 32, y: 19, timeStamp: 1110 },
						{ x: 31, y: 21, timeStamp: 1120 },
					],
					position: {
						x: 0,
						y: 0,
					},
				}],
			}],
		},
	},
	ui: {
		showInterpreter: true,
		threshold: 500,
		ploma: {
			usePloma: true,
			uniqueCanvasFactor: 0.315,
		},
		observeMutations: true,
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
		},
	},
});

export default canvasWithIrregularStrokesWithPloma;
