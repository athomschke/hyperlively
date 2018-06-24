// @flow
import type { HyperlivelyState, CommonAction } from 'src/client/app/typeDefinitions';

import { data } from './data';
import { ui } from './ui';

type HyperlivelyReducer = (state?: HyperlivelyState, action: CommonAction) => HyperlivelyState;

export const initialHyperlivelyState = (): HyperlivelyState => ({
	data: data(undefined, { type: '' }),
	ui: ui(undefined, { type: '' }),
});

export const hyperlively: HyperlivelyReducer = (state = initialHyperlivelyState(), action) => ({
	data: data(state.data, action),
	ui: ui(state.ui, action),
});

export default hyperlively;
