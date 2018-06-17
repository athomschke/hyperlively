// @flow
import { connect } from 'react-redux';

import { appendPoint, createStroke, finishStroke, toggleDrawing } from 'src/client/app/actionCreators';
import ModifierKey from 'src/client/app/components/hoc/ModifierKey';
import Fullscreen from 'src/client/app/components/hoc/Fullscreen';
import DragHandler from 'src/client/app/components/hoc/DragHandler';
import Window from 'src/client/app/components/dumb/Window';

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
