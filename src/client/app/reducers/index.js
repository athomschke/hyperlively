// @flow
import type { HyperlivelyState, CommonAction } from 'src/client/app/typeDefinitions';

import { threshold } from './threshold';
import { ploma } from './ploma';
import { observeMutations } from './observeMutations';
import { data } from './data';
import { specificActions } from './specificActions';
import { ui } from './ui';

type HyperlivelyReducer = (state?: HyperlivelyState, action: CommonAction) => HyperlivelyState;

export const initialHyperlivelyState = (): HyperlivelyState => ({
	ploma: ploma(undefined, { type: '' }),
	observeMutations: observeMutations(undefined, { type: '' }),
	threshold: threshold(undefined, { type: '' }),
	data: data(undefined, { type: '' }),
	specificActions: specificActions(undefined, { type: '' }),
	ui: ui(undefined, { type: '' }),
});

export const hyperlively: HyperlivelyReducer = (state = initialHyperlivelyState(), action) => ({
	ploma: ploma(state.ploma, action),
	observeMutations: observeMutations(state.observeMutations, action),
	threshold: threshold(state.threshold, action),
	data: data(state.data, action),
	specificActions: specificActions(state.specificActions, action),
	ui: ui(state.ui, action),
});

export default hyperlively;
