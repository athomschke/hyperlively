import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { forEach } from 'lodash';
import Modal from 'react-modal';
import { shallow } from 'enzyme';
import InterpretationChooser from 'components/smart/InterpretationChooser';
import ActionChooser from 'components/smart/ActionChooser';
import ParameterChooser from 'components/smart/ParameterChooser';

const renderWithProps = props => TestUtils.renderIntoDocument(<InterpretationChooser {...props} />);
const shallowWithProps = props => shallow(<InterpretationChooser {...props} />);

const exampleChecks = [['a', 'a2'], ['b']];

const exampleParameters = ['a2', 'b'];

const exampleTree = {
	a: {
		a1: 'a1',
		a2: 'a2',
	},
	b: 'b',
	c: 'c',
};

const exampleLastStrokes = [{
	d: 'd',
}];

const exampleSelectedStrokes = [{
	e: 'e',
}];

const flattenedTree = (root) => {
	let items = [root];
	forEach(root.children, (child) => {
		items = items.concat(flattenedTree(child));
	});
	return items;
};

describe('Interpretation Chooser', () => {
	afterEach(() => {
		forEach(document.getElementsByClassName('ReactModalPortal'), (modalNode) => {
			modalNode.parentNode.removeChild(modalNode);
		});
	});

	describe('showing the action chooser', () => {
		let interpretationChooser;

		beforeEach(() => {
			interpretationChooser = shallowWithProps({
				isOpen: true,
				jsonTree: exampleTree,
				lastStrokes: exampleLastStrokes,
				selectedStrokes: exampleSelectedStrokes,
			});
		});

		it('renders an interpretationChooser', () => {
			const actionChooser = interpretationChooser.find(ActionChooser);
			expect(actionChooser).to.exist();
		});

		it('renders a parameter chooser', () => {
			expect(interpretationChooser.find(ParameterChooser)).to.exist();
		});

		it('shows a modal dialog', () => {
			const modal = interpretationChooser.find(Modal);
			expect(modal.props().isOpen).to.be.true();
		});
	});

	describe('Choosing an action', () => {
		it('performs the action', () => {
			const interpretationChooser = shallowWithProps({
				isOpen: true,
			});
			interpretationChooser.instance().componentDidMount();
			sinon.spy(interpretationChooser.instance(), 'onInterpretationChoose');
			interpretationChooser.instance().onActionChoose({}, 'actionName');
			expect(interpretationChooser.instance().onInterpretationChoose.callCount).to.equal(1);
		});

		it('selects checked values from json tree and passes them in an array', () => {
			let passedValues;
			const interpretationChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
				onInterpretationChoose: (event, name, values) => {
					passedValues = values;
				},
			});
			interpretationChooser.setState({
				parameters: exampleParameters,
			});
			interpretationChooser.onInterpretationChoose({}, 'updateThreshold');
			expect(passedValues.length).to.equal(2);
			expect(passedValues[0]).to.equal('a2');
			expect(passedValues[1]).to.equal('b');
		});

		it('can pass selected strokes', () => {
			let passedValues;
			const interpretationChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
				selectedStrokes: exampleSelectedStrokes,
				onInterpretationChoose: (event, name, values) => {
					passedValues = values;
				},
			});
			interpretationChooser.setState({
				parameters: ['e'],
			});
			interpretationChooser.onInterpretationChoose({}, 'updateThreshold');
			expect(passedValues.length).to.equal(1);
			expect(passedValues[0]).to.equal('e');
		});
	});

	describe('Choosing a parameter', () => {
		it('remembers them for later', () => {
			const interpretationChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
			});
			interpretationChooser.onParameterChoose([['a']]);
			expect(interpretationChooser.state.parameters[0][0]).to.equal('a');
		});
	});
});
