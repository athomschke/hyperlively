// @flow
import { expect } from 'chai';
import React from 'react';
import { forEach } from 'lodash';
import { shallow } from 'enzyme';
import { stub } from 'sinon';

import InterpretationChooser, { type InterpretationChooserProps } from 'src/client/app/components/smart/InterpretationChooser';
import ActionChooser from 'src/client/app/containers/ActionChooser/ActionChooser';
import ParameterChooser from 'src/client/app/containers/ParameterChooser/ParameterChooser';

// const renderWithProps = (props: InterpretationChooserProps) =>
// 	TestUtils.renderIntoDocument(<InterpretationChooser {...props} />);

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
	parameters: [],
	functions: [],
});

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

	describe('Ticking an action', () => {
		it('Does nothing without a callback', () => {
			const interpretationChooser = shallowWithProps(defaultProps());
			interpretationChooser.instance().onInterpretationTick();
			expect(interpretationChooser).to.exist();
		});

		it('triggers the onInterpretationTick property callback', () => {
			const onInterpretationTick = stub();
			const interpretationChooser = shallowWithProps({
				...defaultProps(),
				onInterpretationTick,
				parameters: ['a'],
				functions: [{
					name: 'actionName',
					parameters: 1,
				}],
			});
			const tickButton = findElementOfTypeWithTextContent(interpretationChooser, 'button', 'Tick');
			tickButton.simulate('click');
			const [functions, parameters, interval] = onInterpretationTick.args[0];
			expect(functions).to.have.length(1);
			expect(functions[0].name).to.equal('actionName');
			expect(functions[0].parameters).to.equal(1);
			expect(parameters[0]).to.deep.equal('a');
			expect(interval).to.equal(1000);
		});
	});
});
