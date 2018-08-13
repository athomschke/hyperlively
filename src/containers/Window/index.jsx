// @flow
import { connect } from 'react-redux';

import {
	appendPoint, createStroke, finishStroke, toggleDrawing,
} from 'src/actionCreators';
import ModifierKey from 'src/decorators/ModifierKey';
import Fullscreen from 'src/decorators/Fullscreen';
import DragHandler from 'src/containers/Window/DragHandler';

import Window from './Window';

const WindowContainer = ModifierKey(Fullscreen(DragHandler(Window)));

const mapDispatchToProps = dispatch => ({
	onDrag: (event) => {
		dispatch(appendPoint(event.pageX, event.pageY, Date.now()));
	},
	onDragStart: (event) => {
		dispatch(createStroke(event.pageX, event.pageY, Date.now()));
		dispatch(toggleDrawing(true));
	},
	onDragEnd: (event) => {
		dispatch(finishStroke(event.pageX, event.pageY, Date.now()));
		dispatch(toggleDrawing(false));
	},
});

export default connect(
	state => state,
	mapDispatchToProps,
)(WindowContainer);
