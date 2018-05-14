// @flow
import { combineReducers } from 'redux';

import type { HyperlivelyState, Action } from 'src/client/app/typeDefinitions';

import { threshold } from './threshold';
import { ploma } from './ploma';
import { handwritingRecognition } from './handwritingRecognition';
import { observeMutations } from './observeMutations';
import { interpretation } from './interpretation';
import { drawing } from './drawing';
import { content } from './content';
import { specificActions } from './specificActions';

type HyperlivelyReducer = (state: HyperlivelyState, action: Action) => HyperlivelyState;

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
