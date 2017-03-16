import { connect } from 'react-redux';
import actions from 'actions/actions';
import { PAPER_COLOR, WHITE } from 'constants/drawing';
import Desk from 'components/smart/Desk';
import ModuleChooser from 'components/smart/ModuleChooser';
import SketchTransformer from 'components/smart/SketchTransformer';
import PlomaDrawer from 'components/smart/PlomaDrawer';
import PlainDrawer from 'components/smart/PlainDrawer';
import BoundsMutationObserver from 'components/smart/BoundsMutationObserver';
import ModifierKey from 'components/smart/ModifierKey';
import Fullscreen from 'components/smart/Fullscreen';
import Interpreter from 'components/smart/Interpreter';
import SketchCombiner from 'components/smart/SketchCombiner';

const mapStateToProps = (state, ownProps) => {
	const returnState = {};
	Object.assign(returnState, state.ploma, ownProps);
	returnState.handwritingRecognitionEnabled = state.handwritingRecognition;
	returnState.componentIndex = state.ploma.usePloma ? 1 : 0;
	returnState.components = returnState.scene && returnState.scene.strokes;
	returnState.paperColor = returnState.usePloma ? PAPER_COLOR : WHITE;
	returnState.observeMutations = state.observeMutations;
	returnState.showInterpreter = state.interpretation.showInterpreter;
	returnState.interpretations = state.interpretation.interpretations;
	return returnState;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	performAction: (actionName, ...args) => {
		if (actions[actionName]) {
			dispatch(actions.setObserveMutations(false));
			dispatch(actions[actionName](...args));
			dispatch(actions.setObserveMutations(true));
		}
	},
	onHide: (strokes) => {
		dispatch(actions.hide(strokes, ownProps.sceneIndex));
	},
	onInterpretationDone: (bool) => {
		dispatch(actions.toggleInterpreter(bool));
	},
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SketchCombiner(
	Fullscreen(
		ModifierKey(
			Interpreter(
				Desk(
					SketchTransformer(
						ModuleChooser([
							BoundsMutationObserver(PlainDrawer),
							BoundsMutationObserver(PlomaDrawer)]),
						),
					),
				),
			),
		),
	),
);
