// @flow

import type { HyperlivelyState } from 'src/client/app/types';

const emptyCanvas = (): HyperlivelyState => ({
	data: {
		specificActions: [],
		sceneIndex: 0,
		interpretation: {
			showInterpreter: true,
			interpretations: {
				shapes: [],
				texts: [],
			},
		},
		scenes: {
			past: [],
			present: [],
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

export default emptyCanvas;
