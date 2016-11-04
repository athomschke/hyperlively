import { connect } from 'react-redux';
import AppConfiguration from 'components/dumb/AppConfiguration';

const mapStateToProps = (state) => {
	return {
		active: !state.drawing
	};
};

const mapDispatchToProps = () => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AppConfiguration);