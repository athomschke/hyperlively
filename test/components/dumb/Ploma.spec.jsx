import Ploma from 'src/client/app/components/dumb/Ploma';

describe('Ploma Configuration', () => {
	it('labels the button Ploma', () => {
		const component = Ploma({});
		expect(component.props.label).to.equal('Use Ploma');
	});
});
