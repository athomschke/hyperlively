// @flow
import type { HyperlivelyState, CommonAction } from 'src/client/app/typeDefinitions';

import { data } from './data';
import { specificActions } from './specificActions';
import { ui } from './ui';

type HyperlivelyReducer = (state?: HyperlivelyState, action: CommonAction) => HyperlivelyState;

export const initialHyperlivelyState = (): HyperlivelyState => ({
	data: data(undefined, { type: '' }),
	specificActions: specificActions(undefined, { type: '' }),
	ui: ui(undefined, { type: '' }),
});

export const hyperlively: HyperlivelyReducer = (state = initialHyperlivelyState(), action) => ({
	data: data(state.data, action),
	specificActions: specificActions(state.specificActions, action),
	ui: ui(state.ui, action),
});

export default hyperlively;
