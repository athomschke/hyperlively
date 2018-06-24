// @flow
import { connect } from 'react-redux';

import { togglePloma } from 'src/client/app/actionCreators';
import type { HyperlivelyState } from 'src/client/app/typeDefinitions';
import Ploma from 'src/client/app/components/dumb/Ploma';

const mapStateToProps = (state: HyperlivelyState) => ({
	checked: state.ploma.usePloma,
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
