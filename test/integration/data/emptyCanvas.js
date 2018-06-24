// @flow

import type { HyperlivelyState } from 'src/client/app/typeDefinitions';

const emptyCanvas = (): HyperlivelyState => ({
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
