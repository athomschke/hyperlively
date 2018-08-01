// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import LabeledJsonPropertyChooser from 'src/components/LabeledJsonPropertyChooser';
import * as actionCreators from 'src/actionCreators';
import type { FunctionConfiguration } from 'src/types';

import ActionChooser, { type ActionChooserProps } from './ActionChooser';

const defaultProps = (): ActionChooserProps => ({
	onFunctionsChoose: (_actionSignatures: Array<FunctionConfiguration>) => {},
	checkedPaths: [],
	expandedPaths: [],
	specificActions: [],
	onExpandedPathsChange: () => {},
	onCheckedPathsChange: () => {},
});

const shallowWithProps = props => shallow(<ActionChooser {...props} />);

describe('Action Chooser', () => {
	describe('showing the action chooser', () => {
		it('renders a list', () => {
			const actionChooser = shallowWithProps();
			const list = actionChooser.find(LabeledJsonPropertyChooser);
			expect(Object.keys(list.props().jsonTree).length).to.not.equal(0);
		});

		it('renders an item for each available action type', () => {
			const actionChooser = shallowWithProps(defaultProps());
			const list = actionChooser.find(LabeledJsonPropertyChooser);
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
			const list = actionChooser.find(LabeledJsonPropertyChooser);
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
			const list = actionChooser.find(LabeledJsonPropertyChooser);
			const hardcodedActionsLength = Object.keys(actionCreators).length;
			const allItems = list.props().jsonTree;
			expect(Object.keys(allItems)).to.have.length(hardcodedActionsLength + 1);
			expect(allItems[hardcodedActionsLength]).to.equal('firstAThenB ()');
		});
	});

	describe('Choosing an action', () => {
		it('performs the second action', () => {
			const onFunctionsChoose = spy();
			const actionChooser = shallowWithProps({
				...defaultProps(),
				onFunctionsChoose,
			});

			const list = actionChooser.find(LabeledJsonPropertyChooser);
			list.prop('onParameterChoose')(['1']);
			expect(onFunctionsChoose.callCount).to.equal(1);
		});
	});
});
