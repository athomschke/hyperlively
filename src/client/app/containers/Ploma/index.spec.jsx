// @flow
import { expect } from 'chai';

import { Ploma } from '.';

describe('Ploma Configuration', () => {
	it('labels the button Ploma', () => {
		const component = Ploma({
			checked: false,
			onChange: () => {},
		});
		expect(component.props.label).to.equal('Use Ploma');
	});
});
