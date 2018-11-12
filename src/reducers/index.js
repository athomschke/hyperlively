// @flow
import type { HyperlivelyState, CommonAction, Scene } from 'src/types';

import { data } from './data';
import ui from './ui';

type HyperlivelyReducer = (state?: HyperlivelyState, action: CommonAction) => HyperlivelyState;

export const initialHyperlivelyState = (): HyperlivelyState => ({
	data: data(undefined, { type: '' }),
	ui: ui(undefined, { type: '' }),
});

export const hyperlively: HyperlivelyReducer = (state = initialHyperlivelyState(), action) => {
	Object.keys(action).forEach((actionKey) => {
		const scene: Scene = state.data.scenes.present[state.data.sceneIndex];
		if (action[actionKey] === 'selectedStrokes') {
			// eslint-disable-next-line no-param-reassign
			action[actionKey] = (scene.strokes.filter(stroke => stroke.selected): any);
		}
	});
	return {
		data: data(state.data, action),
		ui: ui(state.ui, action),
	};
};

export default hyperlively;
