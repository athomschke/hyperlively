import React from 'react';
import { shallow } from 'enzyme';
import HoverList from 'components/smart/HoverList';
import ActionChooser from 'components/smart/ActionChooser';
import actions from 'actions/actions';

const shallowWithProps = props => shallow(<ActionChooser {...props} />);

describe('Action Chooser', () => {
	let actionChooser;

	beforeEach(() => {
		actionChooser = shallowWithProps({});
	});

	describe('showing the action chooser', () => {
		it('renders a list', () => {
			const list = actionChooser.find(HoverList);
			expect(list.props().items.length).to.not.equal(0);
		});

		it('renders an item for each available action type', () => {
			const items = actionChooser.find(HoverList).props().items;
			expect(items).to.have.length(Object.keys(actions).length);
		});
	});

	describe('Choosing an action', () => {
		it('performs the action', () => {
			sinon.spy(actionChooser.instance(), 'onActionChoose');
			const list = actionChooser.find(HoverList);
			list.props().onItemClick({}, 'updatePosition');
			expect(actionChooser.instance().onActionChoose.callCount).to.equal(1);
		});
	});
});
