// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import ActionChooser from 'src/client/app/containers/ActionChooser/ActionChooser';
import JsonPropertyChooser from 'src/client/app/components/JsonPropertyChooser';
import * as actionCreators from 'src/client/app/actionCreators';

const shallowWithProps = props => shallow(<ActionChooser {...props} />);

describe('Action Chooser', () => {
	describe('showing the action chooser', () => {
		it('renders a list', () => {
			const actionChooser = shallowWithProps({});
			const list = actionChooser.find(JsonPropertyChooser);
			expect(Object.keys(list.props().jsonTree).length).to.not.equal(0);
		});

		it('renders an item for each available action type', () => {
			const actionChooser = shallowWithProps({});
			const list = actionChooser.find(JsonPropertyChooser);
			const items = Object.keys(list.props().jsonTree);
			expect(items).to.have.length(Object.keys(actionCreators).length);
		});

		it('renders an item for each specific action defined as combination', () => {
			const actionChooser = shallowWithProps({
				specificActions: [{
					actionName: 'addSceneAtThenNext',
					actionNames: ['addSceneAt', 'nextScene'],
				}],
			});
			const list = actionChooser.find(JsonPropertyChooser);
			const hardcodedActionsLength = Object.keys(actionCreators).length;
			const allItems = list.props().jsonTree;
			expect(Object.keys(allItems)).to.have.length(hardcodedActionsLength + 1);
			expect(allItems[hardcodedActionsLength]).to.equal('addSceneAtThenNext (number)');
		});

		it('does not show any parameters', () => {
			const actionChooser = shallowWithProps({
				specificActions: [{
					actionName: 'firstAThenB',
					actionNames: ['A', 'B'],
				}],
			});
			const list = actionChooser.find(JsonPropertyChooser);
			const hardcodedActionsLength = Object.keys(actionCreators).length;
			const allItems = list.props().jsonTree;
			expect(Object.keys(allItems)).to.have.length(hardcodedActionsLength + 1);
			expect(allItems[hardcodedActionsLength]).to.equal('firstAThenB ()');
		});
	});

	describe('Choosing an action', () => {
		it('performs the action', () => {
			const actionChooser = shallowWithProps({});
			spy(actionChooser.instance(), 'onFunctionsChoose');
			const list = actionChooser.find(JsonPropertyChooser);
			list.props().onParameterChoose(['hide (strokes)']);
			expect(actionChooser.instance().onFunctionsChoose.callCount).to.equal(1);
		});
	});
});
