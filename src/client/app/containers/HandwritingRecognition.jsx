import { connect } from 'react-redux';
import { toggleHandwritingRecognition } from 'actions/configuring';
import Ploma from 'components/dumb/Ploma';

const mapStateToProps = (state) => {
	return {
		checked: state.handwritingRecognition
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChange: (bool) => {
			dispatch(toggleHandwritingRecognition(bool));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Ploma);