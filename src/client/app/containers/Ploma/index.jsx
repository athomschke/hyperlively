// @flow
import { connect } from 'react-redux';

import { togglePloma } from 'src/client/app/actionCreators';
import type { HyperlivelyState } from 'src/client/app/types';

import Ploma from './Ploma';

const mapStateToProps = (state: HyperlivelyState) => ({
	checked: state.ui.ploma.usePloma,
});

const mapDispatchToProps = dispatch => ({
	onChange: (bool) => {
		dispatch(togglePloma(bool));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Ploma);
