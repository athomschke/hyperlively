// @flow
import jsdom from 'jsdom-global';
import { expect } from 'chai';
import { useFakeXMLHttpRequest } from 'sinon';

import { shapeResponse, textResponse, strokesExample } from 'src/constants/mocks';

import { requestShapeCandidates, requestTextCandidates } from './handwritingRecognizer';

describe('src/helpers for handwriting recognition', () => {
	let requests = [];
	let cleanup;

	beforeEach(() => {
		cleanup = jsdom();
		global.XMLHttpRequest = useFakeXMLHttpRequest();
		(XMLHttpRequest:any).onCreate = (req) => {
			requests.push(req);
		};
	});

	afterEach(() => {
		(XMLHttpRequest:any).restore();
		requests = [];
		cleanup();
	});

	describe('recognizing shapes in handwriting', () => {
		it('finds a single shape in the response when in shape domain', (done) => {
			requestShapeCandidates(strokesExample()).then((shapeCandidates) => {
				expect(shapeCandidates).to.have.length(1);
				done();
			});
			requests[0].respond(
				200,
				{ 'Content-Type': 'application/json' },
				shapeResponse(),
			);
		});

		it('handles no shape result when in shape domain', (done) => {
			requestShapeCandidates(strokesExample()).then((shapeCandidates) => {
				expect(shapeCandidates).to.have.length(0);
				done();
			});
			requests[0].respond(
				200,
				{ 'Content-Type': 'application/json' },
				'{"result": null}',
			);
		});
	});

	describe('recognizing text in handwriting', () => {
		it('handles result when in text domain', (done) => {
			requestTextCandidates(strokesExample()).then((textCandidates) => {
				expect(textCandidates).to.have.length(0);
				done();
			});
			requests[0].respond(
				200,
				{ 'Content-Type': 'application/json' },
				'{"result": null}',
			);
		});

		it('handles no text result when in text domain', (done) => {
			requestTextCandidates(strokesExample()).then((textCandidates) => {
				expect(textCandidates).to.have.length(0);
				done();
			});
			requests[0].respond(
				200,
				{ 'Content-Type': 'application/json' },
				'{"result": { "textSegmentResult": { "candidates": [] } } }',
			);
		});

		it('finds a single text in the response when in text domain', (done) => {
			requestTextCandidates(strokesExample()).then((textCandidates) => {
				expect(textCandidates).to.have.length(1);
				done();
			});
			requests[0].respond(
				200,
				{ 'Content-Type': 'application/json' },
				textResponse(),
			);
		});
	});
});
