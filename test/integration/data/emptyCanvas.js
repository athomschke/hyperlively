// @flow

import type { HyperlivelyState } from 'src/client/app/typeDefinitions';

const emptyCanvas = (): HyperlivelyState => ({
	drawing: false,
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
	content: {
		sceneIndex: 0,
		undoableScenes: {
			past: [],
			present: [],
			future: [],
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

export default emptyCanvas;
