import HandwritingRecognition from 'components/dumb/HandwritingRecognition';

describe('Handwriting Recognition Configuration', () => {
	it('labels the button Handwriting Recognition', () => {
		const component = HandwritingRecognition({});
		expect(component.props.label).to.equal('Use Handwriting Recognition');
	});
});
