// @flow
import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { forEach } from 'lodash';
import { shallow } from 'enzyme';
import { stub } from 'sinon';

import InterpretationChooser, { type InterpretationChooserProps } from 'src/client/app/components/smart/InterpretationChooser';
import ActionChooser from 'src/client/app/components/smart/ActionChooser';
import ParameterChooser from 'src/client/app/components/smart/ParameterChooser';

const renderWithProps = (props: InterpretationChooserProps) =>
		TestUtils.renderIntoDocument(<InterpretationChooser {...props} />);
const shallowWithProps = (props: InterpretationChooserProps) =>
		shallow(<InterpretationChooser {...props} />);

const defaultProps = () => ({
	isOpen: true,
	jsonTree: {},
	onInterpretationChoose: () => undefined,
	onInterpretationTick: () => undefined,
	interpretations: {
		texts: [],
		shapes: [],
	},
	specificActions: [],
});

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
				...defaultProps(),
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
	});

	describe('Choosing an action', () => {
		it('stores the action', () => {
			const interpretationChooser = shallowWithProps(defaultProps());
			interpretationChooser.instance().componentDidMount();
			interpretationChooser.instance().onActionChoose(['actionName']);
			expect(interpretationChooser.instance().state.functions.length).to.equal(1);
		});

		it('Does nothing without a callback', () => {
			const interpretationChooser = shallowWithProps(defaultProps());
			interpretationChooser.instance().componentDidMount();
			interpretationChooser.instance().onInterpretationChoose();
			expect(interpretationChooser).to.exist();
		});

		it('dispatches it with the right parameters', () => {
			const onInterpretationChoose = stub();
			const interpretationChooser = shallowWithProps({
				...defaultProps(),
				onInterpretationChoose,
			});
			interpretationChooser.instance().componentDidMount();
			interpretationChooser.instance().onActionChoose([{
				name: 'actionName',
				parameters: 3,
			}]);
			interpretationChooser.instance().onParameterChoose([['a']]);
			interpretationChooser.instance().onInterpretationChoose();
			expect(onInterpretationChoose.args[0][0]).to.deep.equal([{
				name: 'actionName',
				parameters: 3,
			}]);
			expect(onInterpretationChoose.args[0][1]).to.deep.equal([['a']]);
		});

		it('selects checked values from json tree and passes them in an array', () => {
			const onInterpretationChoose = stub();
			const interpretationChooser = renderWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				onInterpretationChoose,
			});
			interpretationChooser.setState({
				parameters: exampleParameters,
				functions: [{
					name: 'a2',
					parameters: 2,
				}],
			});
			interpretationChooser.onInterpretationChoose();
			const values = onInterpretationChoose.args[0][1];
			expect(values.length).to.equal(2);
			expect(values[0]).to.equal('a2');
			expect(values[1]).to.equal('b');
		});

		it('can pass selected strokes', () => {
			const onInterpretationChoose = stub();
			const interpretationChooser = renderWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				selectedStrokes: exampleSelectedStrokes,
				onInterpretationChoose,
			});
			interpretationChooser.setState({
				parameters: ['e'],
				functions: [{
					name: 'updateThreshold',
					parameters: 1,
				}],
			});
			interpretationChooser.onInterpretationChoose();
			const values = onInterpretationChoose.args[0][1];
			expect(values.length).to.equal(1);
			expect(values[0]).to.equal('e');
		});

		it('can choose a combined action', () => {
			const onInterpretationChoose = stub();
			const interpretationChooser = renderWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				selectedStrokes: exampleSelectedStrokes,
				specificActions: [{
					actionName: 'combinedAB',
					actionNames: ['updateThreshold', 'updatePosition'],
				}],
				onInterpretationChoose,
			});
			interpretationChooser.setState({
				parameters: ['a1', 'a2'],
				functions: [{
					name: 'combinedAB',
					parameters: 2,
				}],
			});
			interpretationChooser.onInterpretationChoose();
			expect(onInterpretationChoose.lastCall.args[1]).to.eql(['a1', 'a2']);
		});
	});

	describe('Choosing a parameter', () => {
		it('remembers them for later', () => {
			const interpretationChooser = renderWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
			});
			interpretationChooser.onParameterChoose([['a']]);
			expect(interpretationChooser.state.parameters[0][0]).to.equal('a');
		});
	});

	describe('Ticking an action', () => {
		it('Does nothing without a callback', () => {
			const interpretationChooser = shallowWithProps(defaultProps());
			interpretationChooser.instance().componentDidMount();
			interpretationChooser.instance().onInterpretationTick();
			expect(interpretationChooser).to.exist();
		});

		it('triggers the onInterpretationTick property callback', () => {
			const onInterpretationTick = stub();
			const interpretationChooser = shallowWithProps({
				...defaultProps(),
				onInterpretationTick,
			});
			interpretationChooser.instance().onParameterChoose([['a']]);
			interpretationChooser.instance().onActionChoose([{
				name: 'actionName',
				parameter: 1,
			}]);
			const tickButton = findElementOfTypeWithTextContent(interpretationChooser, 'button', 'Tick');
			tickButton.simulate('click');
			const [functions, parameters, interval] = onInterpretationTick.args[0];
			expect(functions).to.have.length(1);
			expect(functions[0].name).to.equal('actionName');
			expect(functions[0].parameter).to.equal(1);
			expect(parameters[0]).to.deep.equal(['a']);
			expect(interval).to.equal(1000);
		});
	});
});
