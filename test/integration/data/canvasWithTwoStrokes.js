// @flow
import type { HyperlivelyState } from 'src/types';
import { initialStrokeReferenceState } from 'src/reducers/data/strokeReference';

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
			points: [
				{ x: 10, y: 10, timeStamp: 100 },
				{ x: 10, y: 30, timeStamp: 101 },
			],
		}, {
			id: 2,
			finished: true,
			points: [
				{ x: 20, y: 10, timeStamp: 1100 },
				{ x: 20, y: 30, timeStamp: 1101 },
			],
		}],
		scenes: {
			past: [
				[{ strokes: [] }],
				[{ strokes: [{ ...initialStrokeReferenceState(), id: 1, length: 0 }] }],
				[{ strokes: [{ ...initialStrokeReferenceState(), id: 1, length: 1 }] }],
				[{ strokes: [{ ...initialStrokeReferenceState(), id: 1, length: 2 }] }],
				[{
					strokes: [
						{ ...initialStrokeReferenceState(), id: 1, length: 2 },
						{ ...initialStrokeReferenceState(), id: 2, length: 0 },
					],
				}],
				[{
					strokes: [
						{ ...initialStrokeReferenceState(), id: 1, length: 2 },
						{ ...initialStrokeReferenceState(), id: 2, length: 1 },
					],
				}],
			],
			present: [{
				strokes: [{ ...initialStrokeReferenceState(), id: 1, length: 2 }, { ...initialStrokeReferenceState(), id: 2, length: 2 }],
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
