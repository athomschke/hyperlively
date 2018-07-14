// @flow
import { expect } from 'chai';

import { PlomaToggle } from '.';

describe('Ploma Configuration', () => {
	it('labels the button Ploma', () => {
		const component = PlomaToggle({
			checked: false,
			onChange: () => {},
		});
		expect(component.props.label).to.equal('Use Ploma');
	});
});
