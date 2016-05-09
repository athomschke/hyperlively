import HistorySlider from 'components/HistorySlider';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('HistorySlider', () => {
	it('can be created', () => {
		TestUtils.renderIntoDocument(<HistorySlider></HistorySlider>)
	})
})