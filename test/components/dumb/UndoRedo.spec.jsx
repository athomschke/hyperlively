import { mount } from 'enzyme';
import React from 'react';
import UndoRedo from 'components/dumb/UndoRedo';

describe('Undo Redo', () => {
	it('is smaller than the window size', () => {
		const appConfigurationWrapper = mount(<UndoRedo />);
		expect(appConfigurationWrapper.find('div').node.offsetWidth < window.innerWidth).to.be.true();
	});
});
