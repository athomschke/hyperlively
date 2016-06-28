import scene from 'reducers/scenes'
import ploma from 'reducers/ploma'
import { combineReducers } from 'redux';

const hyperlively = combineReducers({
	ploma,
	scene
})

export default hyperlively;