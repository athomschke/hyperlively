import { connect } from 'react-redux';
import { togglePloma } from 'actions/configuring';
import Ploma from 'components/dumb/Ploma';

const mapStateToProps = (state) => {
	return {
		checked: state.ploma.usePloma
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChange: (bool) => {
			dispatch(togglePloma(bool));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Ploma);