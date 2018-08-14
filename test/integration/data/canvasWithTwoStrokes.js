// @flow
import type { HyperlivelyState } from 'src/types';

const canvasWithTwoStrokes = (): HyperlivelyState => ({
	data: {
		specificActions: [],
		sceneIndex: 0,
		interpretation: {
			shapes: [],
			texts: [],
		},
		strokes: [{
			id: 1,
			finished: true,
			hidden: false,
			selected: false,
			angle: 0,
			center: {
				x: 0,
				y: 0,
			},
			points: [
				{ x: 10, y: 10, timeStamp: 100 },
				{ x: 10, y: 30, timeStamp: 101 },
			],
			position: {
				x: 0,
				y: 0,
			},
		}, {
			id: 2,
			finished: true,
			hidden: false,
			selected: false,
			angle: 0,
			center: {
				x: 0,
				y: 0,
			},
			points: [
				{ x: 20, y: 10, timeStamp: 1100 },
				{ x: 20, y: 30, timeStamp: 1101 },
			],
			position: {
				x: 0,
				y: 0,
			},
		}],
		scenes: {
			past: [
				[{ strokes: [] }],
				[{ strokes: [{ id: 1, length: 0 }] }],
				[{ strokes: [{ id: 1, length: 1 }] }],
				[{ strokes: [{ id: 1, length: 2 }] }],
				[{ strokes: [{ id: 1, length: 2 }, { id: 2, length: 0 }] }],
				[{ strokes: [{ id: 1, length: 2 }, { id: 2, length: 1 }] }],
			],
			present: [{ strokes: [{ id: 1, length: 2 }, { id: 2, length: 2 }] }],
			future: [],
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
		handwritingRecognition:	false,
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
});

export default canvasWithTwoStrokes;
