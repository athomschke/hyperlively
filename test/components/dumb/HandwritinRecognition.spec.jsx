import HandwritingRecognition from 'components/dumb/HandwritingRecognition';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('Handwriting Recognition Configuration', () => {

	it('labels the button Handwriting Recognition', () => {
		let component = HandwritingRecognition({});
		expect(component.props.label).to.equal('Use Handwriting Recognition');
	});
});