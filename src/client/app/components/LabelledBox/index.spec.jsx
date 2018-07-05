// @flow
import { expect } from 'chai';
import { spy } from 'sinon';
import { shallow } from 'enzyme';
import * as React from 'react';

import LabelledBox, { type LabelledBoxProps } from 'src/client/app/components/LabelledBox';

const defaultProps = () => ({
	label: '',
	onChange: () => {},
	checked: false,
});

const shallowWithProps = (props: LabelledBoxProps) => shallow(<LabelledBox {...props} />);

describe('LabelledBox', () => {
	it('toggling without a callback does not change the checked state', () => {
		const labelledBox = shallowWithProps(defaultProps());
		const checkbox = labelledBox.find('input');
		checkbox.simulate('click');
		expect(checkbox.prop('checked')).to.equal(false);
	});

	it('calls callback with true when not checked and clicked', () => {
		const onChange = spy();
		const labelledBox = shallowWithProps({ ...defaultProps(), onChange, checked: false });
		const checkbox = labelledBox.find('input');
		checkbox.simulate('click');
		expect(onChange.args[0][0]).to.be.true();
	});

	it('displays the label', () => {
		const label = 'Foobar';
		const labelledBox = shallowWithProps({ ...defaultProps(), label });
		const labelNode = labelledBox.find('span');
		expect(labelNode.prop('children')).to.equal(label);
	});

	it('sets the checkbox to checked', () => {
		const labelledBox = shallowWithProps({ ...defaultProps(), checked: true });
		const inputNode = labelledBox.find('input');
		expect(inputNode.prop('checked')).to.be.true();
	});
});
