// @flow
import { connect } from 'react-redux';

import SketchCombiner from 'src/client/app/components/hoc/SketchCombiner';

import Page from './Page';

const SketchCombinedPage = SketchCombiner(Page);

const mapStateToProps = (state) => {
	const returnState = {};
	returnState.threshold = state.threshold;
	returnState.drawing = state.drawing;
	returnState.sceneIndex = state.data.sceneIndex;
	returnState.scene = state.data.undoableScenes.present[state.data.sceneIndex];
	returnState.interpretation = state.interpretation;
	returnState.specificActions = state.specificActions;
	return returnState;
};

const mapDispatchToProps = () => ({ });

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SketchCombinedPage);
