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

const findElementOfTypeWithTextContent = (wrapper, type, content) =>
	wrapper.findWhere(n => n.type() === type && n.text().indexOf(content) >= 0);

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

		it('renders a button to accept the interpretation', () => {
			expect(findElementOfTypeWithTextContent(interpretationChooser, 'button', 'Accept')).to.have.length(1);
		});

		it('renders a button to start ticking', () => {
			expect(findElementOfTypeWithTextContent(interpretationChooser, 'button', 'Tick')).to.have.length(1);
		});

		it('shows a modal dialog', () => {
			const modal = interpretationChooser.find(Modal);
			expect(modal.props().isOpen).to.be.true();
		});
	});

	describe('Choosing an action', () => {
		it('stores the action', () => {
			const interpretationChooser = shallowWithProps({
				isOpen: true,
			});
			interpretationChooser.instance().componentDidMount();
			interpretationChooser.instance().onActionChoose(['actionName']);
			expect(interpretationChooser.instance().state.functions.length).to.equal(1);
		});

		it('Does nothing without a callback', () => {
			const interpretationChooser = shallowWithProps({
				isOpen: true,
			});
			interpretationChooser.instance().componentDidMount();
			interpretationChooser.instance().onInterpretationChoose();
			expect(interpretationChooser).to.exist();
		});

		it('dispatches it with the right parameters', () => {
			let functions;
			let parameters;
			const interpretationChooser = shallowWithProps({
				isOpen: true,
				onInterpretationChoose: (passedFunctions, passedParameters) => {
					functions = passedFunctions;
					parameters = passedParameters;
				},
			});
			interpretationChooser.instance().componentDidMount();
			sinon.spy(interpretationChooser.instance(), 'onInterpretationChoose');
			interpretationChooser.instance().onActionChoose([{
				name: 'actionName',
				parameters: 3,
			}]);
			interpretationChooser.instance().onParameterChoose([['a']]);
			interpretationChooser.instance().onInterpretationChoose();
			expect(functions).to.deep.equal([{
				name: 'actionName',
				parameters: 3,
			}]);
			expect(parameters).to.deep.equal([['a']]);
		});

		it('selects checked values from json tree and passes them in an array', () => {
			let passedValues;
			const interpretationChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
				onInterpretationChoose: (name, values) => {
					passedValues = values;
				},
			});
			interpretationChooser.setState({
				parameters: exampleParameters,
				functions: [{
					name: 'a2',
					parameters: 2,
				}],
			});
			interpretationChooser.onInterpretationChoose();
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
				onInterpretationChoose: (name, values) => {
					passedValues = values;
				},
			});
			interpretationChooser.setState({
				parameters: ['e'],
				functions: [{
					name: 'updateThreshold',
					parameters: 1,
				}],
			});
			interpretationChooser.onInterpretationChoose();
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

	describe('Ticking an action', () => {
		it('Does nothing without a callback', () => {
			const interpretationChooser = shallowWithProps({
				isOpen: true,
			});
			interpretationChooser.instance().componentDidMount();
			interpretationChooser.instance().onInterpretationTick();
			expect(interpretationChooser).to.exist();
		});

		it('triggers the onInterpretationTick property callback', () => {
			let tickedActionFunctions;
			let tickedActionParameters;
			let tickedActionInterval;
			const interpretationChooser = shallowWithProps({
				isOpen: true,
				onInterpretationTick: (functions, parameters, interval) => {
					tickedActionFunctions = functions;
					tickedActionParameters = parameters;
					tickedActionInterval = interval;
				},
			});
			interpretationChooser.instance().onParameterChoose([['a']]);
			interpretationChooser.instance().onActionChoose([{
				name: 'actionName',
				parameter: 1,
			}]);
			const tickButton = findElementOfTypeWithTextContent(interpretationChooser, 'button', 'Tick');
			tickButton.simulate('click');
			expect(tickedActionFunctions).to.have.length(1);
			expect(tickedActionFunctions[0].name).to.equal('actionName');
			expect(tickedActionFunctions[0].parameter).to.equal(1);
			expect(tickedActionParameters[0]).to.deep.equal(['a']);
			expect(tickedActionInterval).to.equal(1000);
		});
	});
});
