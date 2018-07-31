// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import PrefixedJSONPropertyChooser from 'src/containers/ParameterChooser/PrefixedJSONPropertyChooser';
import * as actionCreators from 'src/actionCreators';
import type { FunctionConfiguration } from 'src/types';

import ActionChooser from './ActionChooser';

const defaultProps = () => ({
	onFunctionsChoose: (_actionSignatures: Array<FunctionConfiguration>) => {},
	checkedPaths: [],
	expandedPaths: [],
	onExpandedPathsChange: () => {},
	onCheckedPathsChange: () => {},
});

const shallowWithProps = props => shallow(<ActionChooser {...props} />);

describe('Action Chooser', () => {
	describe('showing the action chooser', () => {
		it('renders a list', () => {
			const actionChooser = shallowWithProps();
			const list = actionChooser.find(PrefixedJSONPropertyChooser);
			expect(Object.keys(list.props().jsonTree).length).to.not.equal(0);
		});

		it('renders an item for each available action type', () => {
			const actionChooser = shallowWithProps(defaultProps());
			const list = actionChooser.find(PrefixedJSONPropertyChooser);
			const items = Object.keys(list.props().jsonTree.actions);

			expect(items).to.have.length(Object.keys(actionCreators).length);
		});

		it('renders an item for each specific action defined as combination', () => {
			const actionChooser = shallowWithProps({
				specificActions: [{
					actionName: 'addSceneAtThenNext',
					actionNames: ['addSceneAt', 'nextScene'],
				}],
			});
			const list = actionChooser.find(PrefixedJSONPropertyChooser);
			const hardcodedActionsLength = Object.keys(actionCreators).length;
			const allItems = list.props().jsonTree.actions;
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
			const list = actionChooser.find(PrefixedJSONPropertyChooser);
			const hardcodedActionsLength = Object.keys(actionCreators).length;
			const allItems = list.props().jsonTree.actions;
			expect(Object.keys(allItems)).to.have.length(hardcodedActionsLength + 1);
			expect(allItems[hardcodedActionsLength]).to.equal('firstAThenB ()');
		});
	});

	describe('Choosing an action', () => {
		it('performs the action', () => {
			const actionChooser = shallowWithProps(defaultProps());
			spy(actionChooser.instance(), 'onFunctionsChoose');
			const list = actionChooser.find(PrefixedJSONPropertyChooser);
			list.props().onParameterChoose(['hide (strokes)']);
			expect(actionChooser.instance().onFunctionsChoose.callCount).to.equal(1);
		});
	});
});
