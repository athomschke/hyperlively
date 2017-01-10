import { connect } from 'react-redux';
import { updateThreshold } from 'actions/configuring';
import Threshold from 'components/dumb/Threshold';

const mapStateToProps = (state) => {
	return {
		threshold: state.threshold
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChange: (newThreshold) => {
			dispatch(updateThreshold(newThreshold));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Threshold);