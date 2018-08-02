// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';
import { chooseFunctions, chooseParameters } from 'src/actionCreators';

import InterpretationDisplay from './InterpretationDisplay';

const mapStateToProps = (state: HyperlivelyState) => ({
	functions: state.ui.interpretations.functions,
	parameters: state.ui.interpretations.parameters,
});

const mapDispatchToProps = dispatch => ({
	onActionClick: newActions => dispatch(chooseFunctions(newActions)),
	onParameterClick: newParameters => dispatch(chooseParameters(newParameters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InterpretationDisplay);
