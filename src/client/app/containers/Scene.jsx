import { connect } from 'react-redux';
import actions from 'actions/actions';
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
import SketchCombiner from 'components/smart/SketchCombiner';
import HandwritingRecognitionTrigger from 'components/smart/HandwritingRecognitionTrigger';

const mapStateToProps = (state, ownProps) => {
	let returnState = {};
	Object.assign(returnState, state.ploma, ownProps);
	returnState.handwritingRecognitionEnabled = state.handwritingRecognition;
	returnState.componentIndex = state.ploma.usePloma ? 1 : 0;
	returnState.components = returnState.scene && returnState.scene.strokes;
	returnState.paperColor = returnState.usePloma ? PAPER_COLOR : WHITE;
	returnState.scene = state.content.undoableScenes.present[state.content.sceneIndex];
	returnState.sceneIndex = state.content.sceneIndex;
	returnState.observeMutations = state.observeMutations;
	return returnState;
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		performAction: (actionName, strokes, x, y) => {
			if (actions[actionName]) {
				dispatch(actions.setObserveMutations(false));
				dispatch(actions[actionName](strokes, x, y));
				dispatch(actions.setObserveMutations(true));
			}
		},
		onHide: (strokes) => {
			dispatch(actions.hide(strokes, ownProps.sceneIndex));
		}
	};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SketchCombiner(Fullscreen(ModifierKey(Desk(Interpreter(HandwritingRecognitionTrigger(HandwritingRecognizer(SketchTransformer(ModuleChooser([BoundsMutationObserver(PlainDrawer), BoundsMutationObserver(PlomaDrawer)]))))))))));