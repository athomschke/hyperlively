import React from 'react';
import TestUtils from 'react-addons-test-utils';
import actions from 'actions/actions';
import ActionChooser from 'components/smart/ActionChooser';

let renderWithProps = (props) => {
	return TestUtils.renderIntoDocument(<ActionChooser {...props}/>);
};

describe('Action Chooser', () => {

	describe('showing the action chooser', () => {

		it('renders a list', () => {
			let actionChooser = renderWithProps({
				isOpen: true
			});
			expect(actionChooser.refs.list.props.items.length).to.not.equal(0);
		});

		it('renders a tree', () => {
			let actionChooser = renderWithProps({
				isOpen: true
			});
			expect(actionChooser.refs.tree).to.exist;
		});

		it('renders an item for each available action type', () => {
			let list = renderWithProps({
				isOpen: true
			});
			expect(list.refs.list.props.items).to.have.length(Object.keys(actions).length);
		});

		it('shows a modal dialog', () => {
			let list = renderWithProps({
				isOpen: true
			});
			expect(list.refs.modal.props.isOpen).to.be.true;
		});

	});


	describe('Choosing an action', () => {

		it('performs the action', () => {
			let actionChooser = renderWithProps({
				isOpen: true,
				onActionChoose: (event, actionName) => {
					chosenAction = actionName;
				}
			});
			let chosenAction = undefined;
			actionChooser.refs.list.props.onItemClick({}, 'updatePosition');
			expect(chosenAction).to.equal('updatePosition');
		});

		it('does nothing without a callback', () => {
			let actionChooser = renderWithProps({
				isOpen: true
			});
			actionChooser.refs.list.props.onItemClick({}, 'updatePosition');
			expect(actionChooser).to.exist;
		});
	});
	
});
