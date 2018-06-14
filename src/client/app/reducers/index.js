// @flow
import type { HyperlivelyState, CommonAction } from 'src/client/app/typeDefinitions';

import { threshold } from './threshold';
import { ploma } from './ploma';
import { handwritingRecognition } from './handwritingRecognition';
import { observeMutations } from './observeMutations';
import { interpretation } from './interpretation';
import { drawing } from './drawing';
import { content } from './content';
import { specificActions } from './specificActions';

type HyperlivelyReducer = (state?: HyperlivelyState, action: CommonAction) => HyperlivelyState;

const initialHyperlivelyState = (): HyperlivelyState => ({
	interpretation: interpretation(undefined, { type: '' }),
	ploma: ploma(undefined, { type: '' }),
	handwritingRecognition: handwritingRecognition(undefined, { type: '' }),
	observeMutations: observeMutations(undefined, { type: '' }),
	threshold: threshold(undefined, { type: '' }),
	drawing: drawing(undefined, { type: '' }),
	content: content(undefined, { type: '' }),
	specificActions: specificActions(undefined, { type: '' }),
});

export const hyperlively: HyperlivelyReducer =
(state?: HyperlivelyState = initialHyperlivelyState(), action: CommonAction) => ({
	interpretation: interpretation(state.interpretation, action),
	ploma: ploma(state.ploma, action),
	handwritingRecognition: handwritingRecognition(state.handwritingRecognition, action),
	observeMutations: observeMutations(state.observeMutations, action),
	threshold: threshold(state.threshold, action),
	drawing: drawing(state.drawing, action),
	content: content(state.content, action),
	specificActions: specificActions(state.specificActions, action),
});

export default hyperlively;
