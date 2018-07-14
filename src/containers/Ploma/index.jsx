// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { togglePloma } from 'src/actionCreators';
import type { HyperlivelyState } from 'src/types';
import LabelledBox from 'src/components/LabelledBox';

type PlomaProps = {
	checked: boolean;
	onChange: (_value: boolean) => void;
}

export const PlomaToggle = (props: PlomaProps) => (
	<LabelledBox
		{...props}
		label="Use Ploma"
	/>
);

const mapStateToProps = (state: HyperlivelyState) => ({
	checked: state.ui.ploma.usePloma,
});

const mapDispatchToProps = dispatch => ({
	onChange: (bool) => {
		dispatch(togglePloma(bool));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PlomaToggle);
