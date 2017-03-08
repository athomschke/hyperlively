import { connect } from 'react-redux';
import { toggleHandwritingRecognition } from 'actions/configuring';
import HandwritingRecognition from 'components/dumb/HandwritingRecognition';

const mapStateToProps = state => ({
	checked: state.handwritingRecognition,
});

const mapDispatchToProps = dispatch => ({
	onChange: (bool) => {
		dispatch(toggleHandwritingRecognition(bool));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(HandwritingRecognition);
