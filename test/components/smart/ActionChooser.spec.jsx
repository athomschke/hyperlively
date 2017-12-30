import React from 'react';
import { shallow } from 'enzyme';

import ActionChooser from 'components/smart/ActionChooser';
import JsonPropertyChooser from 'components/smart/JsonPropertyChooser';
import actions from 'actions/actions';

const shallowWithProps = props => shallow(<ActionChooser {...props} />);

describe('Action Chooser', () => {
	let actionChooser;

	beforeEach(() => {
		actionChooser = shallowWithProps({});
	});

	describe('showing the action chooser', () => {
		it('renders a list', () => {
			const list = actionChooser.find(JsonPropertyChooser);
			expect(Object.keys(list.props().jsonTree).length).to.not.equal(0);
		});

		it('renders an item for each available action type', () => {
			const list = actionChooser.find(JsonPropertyChooser);
			const items = Object.keys(list.props().jsonTree);
			expect(items).to.have.length(Object.keys(actions).length);
		});
	});

	describe('Choosing an action', () => {
		it('performs the action', () => {
			sinon.spy(actionChooser.instance(), 'onActionChoose');
			const list = actionChooser.find(JsonPropertyChooser);
			list.props().onParameterChoose({}, 'updatePosition');
			expect(actionChooser.instance().onActionChoose.callCount).to.equal(1);
		});
	});
});
