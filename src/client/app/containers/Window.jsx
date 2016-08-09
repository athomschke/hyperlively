import { connect } from 'react-redux';
import { appendPoint, createStroke, finishStroke } from 'actions/drawing';
import Fullscreen from 'components/smart/Fullscreen';
import ModifierKey from 'components/smart/ModifierKey';
import DragHandler from 'components/smart/DragHandler';
import Window from 'components/dumb/Window';

const mapDispatchToProps = (dispatch) => {
	return {
		onDrag: (event) => {
			dispatch(appendPoint(event));
		},
		onDragStart: (event) => {
			dispatch(createStroke(event));
		},
		onDragEnd: (event) => {
			dispatch(finishStroke(event));
		}
	};
};

export default connect(
	state => state,
	mapDispatchToProps
)(ModifierKey(Fullscreen(DragHandler(Window))));