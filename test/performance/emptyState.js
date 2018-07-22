// @flow
import type {
	Data, HyperlivelyState, Undoable, Scenes,
} from 'src/types';

const scenes: Undoable<Scenes> = {
	past: [],
	present: [],
	future: [],
};

const data: Data = {
	specificActions: [],
	sceneIndex: 0,
	interpretation: {
		shapes: [],
		texts: [],
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
		showInterpreter: true,
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
};

export default hyperlively;
