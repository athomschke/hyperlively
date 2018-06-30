// @flow
import { expect } from 'chai';

import Ploma from 'src/client/app/containers/Ploma/Ploma';

describe('Ploma Configuration', () => {
	it('labels the button Ploma', () => {
		const component = Ploma({});
		expect(component.props.label).to.equal('Use Ploma');
	});
});
