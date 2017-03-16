import { connect } from 'react-redux';
import Page from './Page';

const mapStateToProps = (state) => {
	const returnState = {};
	returnState.threshold = state.threshold;
	returnState.drawing = state.drawing;
	returnState.sceneIndex = state.content.sceneIndex;
	returnState.scene = state.content.undoableScenes.present[state.content.sceneIndex];
	returnState.interpretation = state.interpretation;
	return returnState;
};

const mapDispatchToProps = () => ({ });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
