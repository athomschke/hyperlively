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
		scenes: {
			past: [],
			present: [{
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
			}],
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
