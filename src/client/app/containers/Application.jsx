import { connect } from 'react-redux';
import Page from 'containers/Page';

const mapStateToProps = (state) => {
	let returnState = {};
	returnState.threshold = state.threshold;
	returnState.drawing = state.drawing;
	return returnState;	
};

const mapDispatchToProps = () => {
	return { };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);