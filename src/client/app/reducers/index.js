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
	interpretation: interpretation(undefined, { type: '' }),
	ploma: ploma(undefined, { type: '' }),
	handwritingRecognition: handwritingRecognition(undefined, { type: '' }),
	observeMutations: observeMutations(undefined, { type: '' }),
	threshold: threshold(undefined, { type: '' }),
	drawing: drawing(undefined, { type: '' }),
	content: content(undefined, { type: '' }),
	specificActions: specificActions(undefined, { type: '' }),
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
