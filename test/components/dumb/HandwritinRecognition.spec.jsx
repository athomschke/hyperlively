import HandwritingRecognition from 'components/dumb/HandwritingRecognition';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('Handwriting Recognition Configuration', () => {

	it('labels the button Handwriting Recognition', () => {
		let component = TestUtils.renderIntoDocument(<HandwritingRecognition></HandwritingRecognition>);
		let domNode = findDOMNode(component);
		expect(domNode.textContent).to.equal('Use Handwriting Recognition');
	});
});