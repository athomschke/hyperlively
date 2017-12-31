import { connect } from 'react-redux';

import { togglePloma } from 'src/client/app/actions/configuring';
import Ploma from 'src/client/app/components/dumb/Ploma';

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
