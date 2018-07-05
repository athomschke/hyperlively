// @flow
import { expect } from 'chai';
import { useFakeXMLHttpRequest } from 'sinon';

import { shapeResponse, textResponse, strokesExample } from 'src/client/app/data.spec';

import { requestShapeCandidates, requestTextCandidates } from './handwritingRecognizer';

describe('src/client/app/helpers for handwriting recognition', () => {
	let xhr;
	let requests = [];

	beforeEach(() => {
		xhr = useFakeXMLHttpRequest();
		xhr.onCreate = (req) => {
			requests.push(req);
		};
	});

	afterEach(() => {
		xhr.restore();
		requests = [];
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