// @flow
import { connect } from 'react-redux';

import InterpretationChooser from 'src/client/app/containers/InterpretationChooser/InterpretationChooser';
import type { HyperlivelyState } from 'src/client/app/types';

const mapStateToProps = (state: HyperlivelyState) => ({
	functions: state.ui.interpretations.functions,
	parameters: state.ui.interpretations.parameters,
});

const mapDispatchToProps = _dispatch => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationChooser);
