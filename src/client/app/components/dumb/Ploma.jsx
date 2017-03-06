import React from 'react';
import LabelledBox from './LabelledBox';

export default function (props) {
	return (<LabelledBox
		{...props}
		label={'Use Ploma'}
	/>);
}
