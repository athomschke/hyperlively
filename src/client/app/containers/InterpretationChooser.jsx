// @flow
import { connect } from 'react-redux';

import InterpretationChooser from 'src/client/app/components/smart/InterpretationChooser';
import type { HyperlivelyState } from 'src/client/app/typeDefinitions';
import { chooseFunctions, chooseParameters } from 'src/client/app/actionCreators';

const mapStateToProps = (state: HyperlivelyState) => ({
	functions: state.ui.interpretations.functions,
	parameters: state.ui.interpretations.parameters,
});

const mapDispatchToProps = dispatch => ({
	onFunctionsChoose: functions => dispatch(chooseFunctions(functions)),
	onParametersChoose: parameters => dispatch(chooseParameters(parameters)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationChooser);
