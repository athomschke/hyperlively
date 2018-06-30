// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/client/app/types';

import AppConfiguration from './AppConfiguration';

const mapStateToProps = (state: HyperlivelyState) => ({
	active: !state.ui.drawing,
});

const mapDispatchToProps = () => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AppConfiguration);
