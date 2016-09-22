import Interpreter from 'components/smart/Interpreter';
import { point } from '../../helpers';
import React, { Component, PropTypes } from 'react';
import { TEXT_INPUT_TYPE, LANGUAGE, TEXT_INPUT_MODE } from 'constants/handwriting';
import TestUtils from 'react-addons-test-utils';
import { first, concat, reduce, initial, last } from 'lodash';

const renderWithProps = (props) => {
	class WrappedComponent extends React.Component {
		render () {
			return <div></div>;
		}
	}
	let InterpreterComponent = Interpreter(WrappedComponent);
	return TestUtils.renderIntoDocument(<InterpreterComponent {...props}/>);
};

describe('Interpreter', () => {
 
	let interpreter;

	beforeEach(() => {
		interpreter = renderWithProps({});
	})

	it('renders', () => {
		let interpreter = renderWithProps({});
		expect(interpreter).to.exist;
	})

	it('interprets a lowercase o as a circle', () => {
		let detected = interpreter.onTextDetected([{
			label: 'o'
		}])
		expect(detected).to.equal('circle');
	});

	it('interprets an uppercase O as a circle', () => {
		let detected = interpreter.onTextDetected([{
			label: 'O'
		}])
		expect(detected).to.equal('circle');
	});

	it('does not interpret an I', () => {
		let detected = interpreter.onTextDetected([{
			label: 'I'
		}])
		expect(detected).to.not.equal('circle');
	});

	it('finds an arrow', () => {
		let detected = interpreter.onShapeDetected([{
			label: 'arrow'
		}])
		expect(detected).to.equal('arrow');
	});

	it('ignores a stroke', () => {
		let detected = interpreter.onShapeDetected([{
			label: 'stroke'
		}])
		expect(detected).to.not.equal('arrow');
	});
	
});