// @flow

import type { HyperlivelyState, Stroke, Point } from 'src/types';

const stroke = (id: number, points: Array<Point>, finished: boolean): Stroke => ({
	id,
	hidden: false,
	selected: false,
	finished,
	angle: 0,
	center: {
		x: 0,
		y: 0,
	},
	points,
	position: {
		x: 0,
		y: 0,
	},
});

const canvasWithTwoScenes = (): HyperlivelyState => ({
	data: {
		specificActions: [],
		sceneIndex: 1,
		interpretation: {
			texts: [],
			shapes: [],
		},
		strokes: [
			stroke(1, [
				{ x: 10, y: 10, timeStamp: 100 },
				{ x: 10, y: 30, timeStamp: 101 },
			], true),
			stroke(2, [
				{ x: 20, y: 10, timeStamp: 1100 },
				{ x: 20, y: 30, timeStamp: 1101 },
				{ x: 20, y: 50, timeStamp: 1102 },
				{ x: 20, y: 70, timeStamp: 1103 },
				{ x: 20, y: 90, timeStamp: 1104 },
				{ x: 20, y: 110, timeStamp: 1105 },
			], false),
		],
		scenes: {
			past: [
				[{ strokes: [{ id: 1, length: 1 }] }],
				[{ strokes: [{ id: 1, length: 2 }] }],
				[{ strokes: [{ id: 1, length: 2 }] }, { strokes: [{ id: 2, length: 1 }] }],
				[{ strokes: [{ id: 1, length: 2 }] }, { strokes: [{ id: 2, length: 2 }] }],
				[{ strokes: [{ id: 1, length: 2 }] }, { strokes: [{ id: 2, length: 3 }] }],
				[{ strokes: [{ id: 1, length: 2 }] }, { strokes: [{ id: 2, length: 4 }] }],
				[{ strokes: [{ id: 1, length: 2 }] }, { strokes: [{ id: 2, length: 5 }] }],
			],
			future: [],
			present: [{ strokes: [{ id: 1, length: 2 }] }, { strokes: [{ id: 2, length: 6 }] }],
		},
	},
	ui: {
		showInterpreter: true,
		threshold: 500,
		ploma: {
			usePloma: false,
			uniqueCanvasFactor: NaN,
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

export default canvasWithTwoScenes;
