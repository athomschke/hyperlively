// @flow
import React from 'react';
import LabelledBox from './LabelledBox';

export default function (props: Object) {
	return (<LabelledBox
		{...props}
		label={'Use Handwriting Recognition'}
	/>);
}
