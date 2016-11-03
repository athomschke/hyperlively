import UndoRedo from 'components/dumb/UndoRedo';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('Undo Redo', () => {

	it('is smaller than the window size', () => {
		let appConfiguration = TestUtils.renderIntoDocument(<UndoRedo></UndoRedo>);
		let domNode = findDOMNode(appConfiguration);
		expect(domNode.offsetWidth < window.innerWidth).to.be.true;
	});
});