// @flow
import { connect } from 'react-redux';

import { updateThreshold } from 'src/actionCreators';
import type { HyperlivelyState } from 'src/types';

import Threshold from './Threshold';

const mapStateToProps = (state: HyperlivelyState) => ({
	threshold: state.ui.threshold,
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
