import { connect } from 'react-redux';
import { updateBounds, hide } from 'actions/manipulating';
import { PAPER_COLOR, WHITE} from 'constants/drawing';
import Desk from 'components/smart/Desk';
import ModuleChooser from 'components/smart/ModuleChooser';
import SketchTransformer from 'components/smart/SketchTransformer';
import PlomaDrawer from 'components/smart/PlomaDrawer';
import PlainDrawer from 'components/smart/PlainDrawer';
import BoundsMutationObserver from 'components/smart/BoundsMutationObserver';
import ModifierKey from 'components/smart/ModifierKey';
import Fullscreen from 'components/smart/Fullscreen';
import Interpreter from 'components/smart/Interpreter';
import HandwritingRecognizer from 'components/smart/HandwritingRecognizer';
import HandwritingRecognitionTrigger from 'components/smart/HandwritingRecognitionTrigger';

const mapStateToProps = (state, ownProps) => {
	let returnState = {};
	Object.assign(returnState, state.ploma, ownProps);
	returnState.handwritingRecognitionEnabled = state.handwritingRecognition;
	returnState.componentIndex = state.ploma.usePloma ? 1 : 0;
	returnState.components = returnState.scene && returnState.scene.strokes;
	returnState.drawing = state.drawing;
	returnState.paperColor = returnState.usePloma ? PAPER_COLOR : WHITE;
	return returnState;
};

const mapDispatchToProps = (dispatch) => {
	return {
		onBoundsUpdate: (strokes, newBounds) => {
			dispatch(updateBounds(strokes, newBounds));
		},
		onHide: (strokes) => {
			dispatch(hide(strokes));
		}
	};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fullscreen(ModifierKey(Desk(Interpreter(HandwritingRecognitionTrigger(HandwritingRecognizer(SketchTransformer(ModuleChooser([BoundsMutationObserver(PlainDrawer), BoundsMutationObserver(PlomaDrawer)])))))))));