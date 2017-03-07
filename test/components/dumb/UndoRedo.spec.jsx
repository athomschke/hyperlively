import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import UndoRedo from 'components/dumb/UndoRedo';

describe('Undo Redo', () => {
	it('is smaller than the window size', () => {
		const appConfiguration = TestUtils.renderIntoDocument(<UndoRedo />);
		const domNode = findDOMNode(appConfiguration);
		expect(domNode.offsetWidth < window.innerWidth).to.be.true;
	});
});
