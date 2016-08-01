import scenes from 'reducers/scenes'
import threshold from 'reducers/threshold'
import { DEFAULT_THRESHOLD } from 'constants/drawing'
import ploma from 'reducers/ploma'
import { combineReducers } from 'redux';

const hyperlively = combineReducers({
	ploma,
	scenes,
	threshold
})

export default hyperlively;