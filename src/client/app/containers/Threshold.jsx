// @flow
import { connect } from 'react-redux';

import { updateThreshold } from 'src/client/app/actions';
import Threshold from 'src/client/app/components/dumb/Threshold';

const mapStateToProps = state => ({
	threshold: state.threshold,
});

const mapDispatchToProps = dispatch => ({
	onChange: (newThreshold) => {
		dispatch(updateThreshold(newThreshold));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Threshold);
