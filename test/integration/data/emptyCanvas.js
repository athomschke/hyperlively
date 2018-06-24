// @flow

import type { HyperlivelyState } from 'src/client/app/typeDefinitions';

const emptyCanvas = (): HyperlivelyState => ({
	ploma: {
		usePloma: false,
		uniqueCanvasFactor: NaN,
	},
	specificActions: [],
	threshold: 500,
	handwritingRecognition:	false,
	interpretation: {
		showInterpreter: true,
		interpretations: {
			texts: [],
			shapes: [],
		},
	},
	observeMutations: true,
	data: {
		sceneIndex: 0,
		undoableScenes: {
			past: [],
			present: [],
			future: [],
		},
	},
	ui: {
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
