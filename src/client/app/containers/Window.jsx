import { connect } from 'react-redux';

import { appendPoint, createStroke, finishStroke, toggleDrawing } from 'src/client/app/actions/drawing';
import Fullscreen from 'src/client/app/components/hoc/Fullscreen';
import ModifierKey from 'src/client/app/components/hoc/ModifierKey';
import DragHandler from 'src/client/app/components/hoc/DragHandler';
import Window from 'src/client/app/components/dumb/Window';

const mapDispatchToProps = (dispatch, ownProps) => ({
	onDrag: (event) => {
		dispatch(appendPoint(event.pageX, event.pageY, event.timeStamp, ownProps.sceneIndex));
	},
	onDragStart: (event) => {
		dispatch(createStroke(event.pageX, event.pageY, event.timeStamp, ownProps.sceneIndex));
		dispatch(toggleDrawing(true));
	},
	onDragEnd: (event) => {
		dispatch(finishStroke(event.pageX, event.pageY, event.timeStamp, ownProps.sceneIndex));
		dispatch(toggleDrawing(false));
	},
});

export default connect(
	state => state,
	mapDispatchToProps,
)(ModifierKey(Fullscreen(DragHandler(Window))));
