// @flow
import type { Data, HyperlivelyState, UndoableScenes } from 'src/client/app/typeDefinitions';

const undoableScenes: UndoableScenes = {
	past: [],
	present: [],
	future: [],
};

const data: Data = {
	sceneIndex: 0,
	interpretation: {
		showInterpreter: true,
		interpretations: {
			shapes: [],
			texts: [],
		},
	},
	undoableScenes,
};

const hyperlively: HyperlivelyState = {
	ploma: {
		uniqueCanvasFactor: 35,
		usePloma: true,
	},
	specificActions: [],
	interpretation: {
		showInterpreter: false,
		interpretations: {
			shapes: [],
			texts: [],
		},
	},
	observeMutations: false,
	threshold: 50,
	data,
	ui: {
		handwritingRecognition: false,
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
};

export default hyperlively;
