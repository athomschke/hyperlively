// @flow
import type { Content, HyperlivelyState, UndoableScenes } from 'src/client/app/typeDefinitions';

const undoableScenes: UndoableScenes = {
	past: [],
	present: [],
	future: [],
};

const content: Content = {
	sceneIndex: 0,
	undoableScenes,
};

const hyperlively: HyperlivelyState = {
	ploma: {
		uniqueCanvasFactor: 35,
		usePloma: true,
	},
	handwritingRecognition: false,
	observeMutations: false,
	threshold: 50,
	drawing: false,
	content,
};

export default hyperlively;
