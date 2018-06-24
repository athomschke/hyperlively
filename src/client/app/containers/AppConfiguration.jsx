// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/client/app/typeDefinitions';
import AppConfiguration from 'src/client/app/components/dumb/AppConfiguration';

const mapStateToProps = (state: HyperlivelyState) => ({
	active: !state.ui.drawing,
});

const mapDispatchToProps = () => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AppConfiguration);
