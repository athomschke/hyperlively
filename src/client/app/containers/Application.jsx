import { connect } from 'react-redux';

import SketchCombiner from 'src/client/app/components/hoc/SketchCombiner';
import { relativeDividerPosition } from 'src/client/app/reducers/defaultState';

import Page from './Page';

const SketchCombinedPage = SketchCombiner(Page);

const mapStateToProps = (state) => {
	const returnState = {};
	returnState.threshold = state.threshold;
	returnState.drawing = state.drawing;
	returnState.sceneIndex = state.content.sceneIndex;
	returnState.scene = state.content.undoableScenes.present[state.content.sceneIndex];
	returnState.interpretation = state.interpretation;
	returnState.relativeDividerPosition = relativeDividerPosition;
	returnState.specificActions = state.specificActions;
	return returnState;
};

const mapDispatchToProps = () => ({ });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SketchCombinedPage);
