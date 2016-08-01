import scenes from 'reducers/scenes'
import { DEFAULT_THRESHOLD } from 'constants/drawing'
import ploma from 'reducers/ploma'
import { combineReducers } from 'redux';

const threshold = (state = DEFAULT_THRESHOLD, action) => state

const hyperlively = combineReducers({
	ploma,
	scenes,
	threshold
})

export default hyperlively;