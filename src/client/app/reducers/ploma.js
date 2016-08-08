import { TOGGLE_PLOMA } from 'constants/actionTypes';

let initialState = () => {
	return {
		usePloma: true,
		uniqueCanvasFactor: Math.random()
	}
}

function ploma (state = initialState(), action) {
	switch(action.type) {
		case TOGGLE_PLOMA:
			return {
				usePloma: action.bool,
				uniqueCanvasFactor: state.uniqueCanvasFactor
			}
		default:
			return state;
	}
}

export { ploma }