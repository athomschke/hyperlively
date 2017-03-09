import React from 'react';
import TestUtils from 'react-addons-test-utils';
import HoverList from 'components/smart/HoverList';

describe('HoverList', () => {
	describe('Rendering list items', () => {
		let list;
		let items;

		beforeEach(() => {
			list = TestUtils.renderIntoDocument(<HoverList
				items={['a', 'b', 'c']}
			/>);
			items = TestUtils.scryRenderedDOMComponentsWithTag(list, 'li');
		});

		it('shows all list items', () => {
			expect(items).to.have.length(3);
		});

		it('gives them no icons', () => {
			expect(items[0].style.getPropertyValue('list-style-type')).to.equal('none');
		});
	});

	describe('Hovering over the second list item', () => {
		let list;
		let items;

		beforeEach(() => {
			list = TestUtils.renderIntoDocument(<HoverList
				items={['a', 'b', 'c']}
			/>);
			items = TestUtils.scryRenderedDOMComponentsWithTag(list, 'li');
		});

		it('colors it', () => {
			TestUtils.Simulate.mouseEnter(items[1]);
			expect(items[1].style.getPropertyValue('background-color')).to.not.equal('transparent');
		});
	});

	describe('Leaving the second list item', () => {
		let list;
		let items;

		beforeEach(() => {
			list = TestUtils.renderIntoDocument(<HoverList
				items={['a', 'b', 'c']}
			/>);
			items = TestUtils.scryRenderedDOMComponentsWithTag(list, 'li');
		});

		it('removes its color', () => {
			TestUtils.Simulate.mouseLeave(items[1]);
			expect(items[1].style.getPropertyValue('background-color')).to.equal('transparent');
		});

		it('after entering it removes its color', () => {
			TestUtils.Simulate.mouseEnter(items[1]);
			TestUtils.Simulate.mouseLeave(items[1]);
			expect(items[1].style.getPropertyValue('background-color')).to.equal('transparent');
		});
	});

	describe('clicking the first item', () => {
		it('does nothing if no callback given', () => {
			const list = TestUtils.renderIntoDocument(<HoverList
				items={['a', 'b', 'c']}
			/>);
			const items = TestUtils.scryRenderedDOMComponentsWithTag(list, 'li');
			TestUtils.Simulate.click(items[1]);
			expect(items[1]).to.exist();
		});

		it('calls the callback if handed', () => {
			let clickedItem;
			const list = TestUtils.renderIntoDocument(<HoverList
				items={['a', 'b', 'c']}
				onItemClick={(event, aText) => {
					clickedItem = aText;
				}}
			/>);
			const items = TestUtils.scryRenderedDOMComponentsWithTag(list, 'li');
			TestUtils.Simulate.click(items[1]);
			expect(clickedItem).to.equal('b');
		});
	});
});
