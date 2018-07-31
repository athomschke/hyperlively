// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';

import InterpretationDisplay from './InterpretationDisplay';

const mapStateToProps = (state: HyperlivelyState) => ({
	functions: state.ui.interpretations.functions,
	parameters: state.ui.interpretations.parameters,
});

export default connect(mapStateToProps, () => ({}))(InterpretationDisplay);
