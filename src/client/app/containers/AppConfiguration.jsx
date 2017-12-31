import { connect } from 'react-redux';

import AppConfiguration from 'src/client/app/components/dumb/AppConfiguration';

const mapStateToProps = state => ({
	active: !state.drawing,
});

const mapDispatchToProps = () => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AppConfiguration);
