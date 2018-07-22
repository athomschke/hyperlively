// @flow

import type { HyperlivelyState } from 'src/types';

const emptyCanvas = (): HyperlivelyState => ({
	data: {
		specificActions: [],
		sceneIndex: 0,
		interpretation: {
			shapes: [],
			texts: [],
		},
		scenes: {
			past: [],
			present: [],
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
		},
	},
});

export default emptyCanvas;
