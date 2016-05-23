import scene from 'reducers/scene'
import ploma from 'reducers/ploma'
import { combineReducers } from 'redux';

const hyperlively = combineReducers({
	ploma,
	scene
})

export default hyperlively;