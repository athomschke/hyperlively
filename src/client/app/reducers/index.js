// @flow
import { combineReducers } from 'redux';

import type { HyperlivelyState, Action } from 'src/client/app/typeDefinitions';

import { threshold, initialThresholdState } from './threshold';
import { ploma, initialPlomaState } from './ploma';
import { handwritingRecognition, initialHandwritingRecognitionState } from './handwritingRecognition';
import { observeMutations, initialObserveMutationsState } from './observeMutations';
import { interpretation, initialInterpretationState } from './interpretation';
import { drawing, initialDrawingState } from './drawing';
import { content, initialContentState } from './content';
import { specificActions, initialSpecificActionsState } from './specificActions';

type HyperlivelyReducer = (state: HyperlivelyState, action: Action) => HyperlivelyState;

export const initialHyperlivelyState: HyperlivelyState = {
	interpretation: initialInterpretationState(),
	ploma: initialPlomaState(),
	handwritingRecognition: initialHandwritingRecognitionState(),
	observeMutations: initialObserveMutationsState(),
	threshold: initialThresholdState(),
	drawing: initialDrawingState(),
	content: initialContentState(),
	specificActions: initialSpecificActionsState(),
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
