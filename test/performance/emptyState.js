// @flow
import { DEFAULT_PEN_COLOR } from '../../src/client/app/constants/drawing';
import { type Stroke, type Content, type HyperlivelyState, type UndoableScenes } from '../../src/client/app/typeDefinitions';

const dummyStroke: Stroke = {
	points: [],
	finished: false,
	color: DEFAULT_PEN_COLOR,
	hidden: false,
	selected: false,
};

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
