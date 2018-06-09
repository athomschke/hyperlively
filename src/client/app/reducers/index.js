// @flow
import { combineReducers } from 'redux';

import type { HyperlivelyState, CommonAction } from 'src/client/app/typeDefinitions';

import { threshold } from './threshold';
import { ploma } from './ploma';
import { handwritingRecognition } from './handwritingRecognition';
import { observeMutations } from './observeMutations';
import { interpretation } from './interpretation';
import { drawing } from './drawing';
import { content } from './content';
import { specificActions } from './specificActions';

type HyperlivelyReducer = (state: HyperlivelyState, action: CommonAction) => HyperlivelyState;

export const initialHyperlivelyState: HyperlivelyState = {
	interpretation: interpretation(undefined, { type: 'intial_state' }),
	ploma: ploma(undefined, { type: 'intial_state' }),
	handwritingRecognition: handwritingRecognition(undefined, { type: 'intial_state' }),
	observeMutations: observeMutations(undefined, { type: 'intial_state' }),
	threshold: threshold(undefined, { type: 'intial_state' }),
	drawing: drawing(undefined, { type: 'intial_state' }),
	content: content(undefined, { type: 'intial_state' }),
	specificActions: specificActions(undefined, { type: 'intial_state' }),
};

const hyperlively: HyperlivelyReducer = combineReducers({
	interpretation,
	ploma,
	handwritingRecognition,
	observeMutations,
	threshold,
	drawing,
	content,
	specificActions,
});

export default hyperlively;
