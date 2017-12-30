import { connect } from 'react-redux';

import { togglePloma } from 'actions/configuring';
import Ploma from 'components/dumb/Ploma';

const mapStateToProps = state => ({
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
