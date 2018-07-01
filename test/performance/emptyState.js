// @flow
import type { Data, HyperlivelyState, Undoable, Scenes } from 'src/client/app/types';

const scenes: Undoable<Scenes> = {
	past: [],
	present: [],
	future: [],
};

const data: Data = {
	specificActions: [],
	sceneIndex: 0,
	interpretation: {
		showInterpreter: true,
		interpretations: {
			shapes: [],
			texts: [],
		},
	},
	scenes,
};

const hyperlively: HyperlivelyState = {
	interpretation: {
		showInterpreter: false,
		interpretations: {
			shapes: [],
			texts: [],
		},
	},
	data,
	ui: {
		threshold: 50,
		ploma: {
			uniqueCanvasFactor: 35,
			usePloma: true,
		},
		observeMutations: false,
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
