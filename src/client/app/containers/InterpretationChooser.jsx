// @flow
import { connect } from 'react-redux';

import InterpretationChooser from 'src/client/app/components/smart/InterpretationChooser';
import type { HyperlivelyState } from 'src/client/app/typeDefinitions';

const mapStateToProps = (state: HyperlivelyState) => ({
	functions: state.ui.interpretations.functions,
	parameters: state.ui.interpretations.parameters,
});

const mapDispatchToProps = _dispatch => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationChooser);
