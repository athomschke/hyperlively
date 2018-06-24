// @flow
import type { Data, HyperlivelyState, UndoableScenes } from 'src/client/app/typeDefinitions';

const undoableScenes: UndoableScenes = {
	past: [],
	present: [],
	future: [],
};

const data: Data = {
	sceneIndex: 0,
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
	handwritingRecognition: false,
	observeMutations: false,
	threshold: 50,
	drawing: false,
	data,
	ui: {
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
