import { connect } from 'react-redux';
import AppConfiguration from 'components/dumb/AppConfiguration';

const mapStateToProps = state => ({
	active: !state.drawing,
});

const mapDispatchToProps = () => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AppConfiguration);
