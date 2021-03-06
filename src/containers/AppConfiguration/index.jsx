// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';

import AppConfiguration from './AppConfiguration';

const mapStateToProps = (state: HyperlivelyState) => ({
	active: !state.ui.drawing,
});

export default connect(mapStateToProps, () => ({}))(AppConfiguration);
