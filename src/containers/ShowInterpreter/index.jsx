// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { toggleInterpreter } from 'src/actionCreators';
import type { HyperlivelyState } from 'src/types';
import LabelledBox from 'src/components/LabelledBox';

type ShowInterpreterProps = {
	checked: boolean;
	onChange: (_value: boolean) => void;
}

const ShowInterpreter = (props: ShowInterpreterProps) => (
	<LabelledBox
		{...props}
		label="Show Interpreter"
	/>
);

const mapStateToProps = (state: HyperlivelyState) => ({
	checked: state.ui.showInterpreter,
});

const mapDispatchToProps = dispatch => ({
	onChange: (bool) => {
		dispatch(toggleInterpreter(bool));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ShowInterpreter);
