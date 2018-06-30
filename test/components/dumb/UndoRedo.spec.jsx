// @flow
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';

import UndoRedo from 'src/client/app/containers/UndoRedo/UndoRedo';

describe('Undo Redo', () => {
	it('is smaller than the window size', () => {
		const appConfigurationWrapper = mount(<UndoRedo />);
		expect(appConfigurationWrapper.find('div').at(0).getNode().offsetWidth < window.innerWidth).to.be.true();
	});
});
