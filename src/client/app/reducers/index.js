// @flow
import type { HyperlivelyState, CommonAction } from 'src/client/app/typeDefinitions';

import { threshold } from './threshold';
import { ploma } from './ploma';
import { handwritingRecognition } from './handwritingRecognition';
import { observeMutations } from './observeMutations';
import { interpretation } from './interpretation';
import { drawing } from './drawing';
import { data } from './data';
import { specificActions } from './specificActions';
import { ui } from './ui';

type HyperlivelyReducer = (state?: HyperlivelyState, action: CommonAction) => HyperlivelyState;

export const initialHyperlivelyState = (): HyperlivelyState => ({
	interpretation: interpretation(undefined, { type: '' }),
	ploma: ploma(undefined, { type: '' }),
	handwritingRecognition: handwritingRecognition(undefined, { type: '' }),
	observeMutations: observeMutations(undefined, { type: '' }),
	threshold: threshold(undefined, { type: '' }),
	drawing: drawing(undefined, { type: '' }),
	data: data(undefined, { type: '' }),
	specificActions: specificActions(undefined, { type: '' }),
	ui: ui(undefined, { type: '' }),
});

export const hyperlively: HyperlivelyReducer = (state = initialHyperlivelyState(), action) => ({
	interpretation: interpretation(state.interpretation, action),
	ploma: ploma(state.ploma, action),
	handwritingRecognition: handwritingRecognition(state.handwritingRecognition, action),
	observeMutations: observeMutations(state.observeMutations, action),
	threshold: threshold(state.threshold, action),
	drawing: drawing(state.drawing, action),
	data: data(state.data, action),
	specificActions: specificActions(state.specificActions, action),
	ui: ui(state.ui, action),
});

export default hyperlively;
