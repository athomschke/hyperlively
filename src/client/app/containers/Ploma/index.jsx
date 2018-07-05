// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { togglePloma } from 'src/client/app/actionCreators';
import type { HyperlivelyState } from 'src/client/app/types';
import LabelledBox from 'src/client/app/components/LabelledBox';

type PlomaProps = {
	checked: boolean;
	onChange: (_value: boolean) => void;
}

export const PlomaToggle = (props: PlomaProps) => (<LabelledBox
	{...props}
	label={'Use Ploma'}
/>);

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
