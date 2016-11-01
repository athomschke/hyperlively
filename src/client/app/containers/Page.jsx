import { connect } from 'react-redux';
import { last } from 'lodash';
import SketchCombiner from 'components/smart/SketchCombiner';
import Page from 'components/dumb/Page';

const mapStateToProps = (state) => {
	let returnState = {};
	returnState.threshold = state.threshold;
	returnState.scene = last(state.undoableScenes.present);
	return returnState;	
};

const mapDispatchToProps = () => {
	return { };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SketchCombiner(Page));