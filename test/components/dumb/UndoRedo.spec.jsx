import UndoRedo from 'components/dumb/UndoRedo';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('UndoRedo', () => {

	describe('moving the handle', () => {

		it('does not trigger the callback if ploma is not enabled', () => {
			let func = () => {}
			let undoRedo = TestUtils.renderIntoDocument(<UndoRedo
				max={10}
				value={9}
				usePloma={false}
				temporaryCallback={func}
			></UndoRedo>)
			expect(undoRedo.refs.slider.props.temporaryCallback).to.not.equal(func)
		})

		it('triggers the callback if ploma is enabled', () => {
			let func = () => {}
			let undoRedo = TestUtils.renderIntoDocument(<UndoRedo
				max={10}
				value={9}
				usePloma={true}
				temporaryCallback={func}
			></UndoRedo>)
			expect(undoRedo.refs.slider.props.temporaryCallback).to.equal(func)
		})
	})
	
})