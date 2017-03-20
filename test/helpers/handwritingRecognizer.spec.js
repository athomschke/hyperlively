import { requestShapeRecognitionForStrokesThenDo, requestTextRecognitionForStrokesThenDo } from 'helpers/handwritingRecognizer';
import { shapeResponse, textResponse, strokesExample } from '../data';

describe('Helpers for handwriting recognition', () => {
	describe('recognizing handwriting', () => {
		let xhr;
		let requests = [];

		beforeEach(() => {
			xhr = sinon.useFakeXMLHttpRequest();
			xhr.onCreate = (req) => {
				requests.push(req);
			};
		});

		afterEach(() => {
			xhr.restore();
			requests = [];
		});

		it('finds a single shape in the response when in shape domain', (done) => {
			requestShapeRecognitionForStrokesThenDo(strokesExample, (shapeCandidates) => {
				expect(shapeCandidates).to.have.length(1);
				done();
			});
			requests[0].respond(
				200,
				{ 'Content-Type': 'application/json' },
				shapeResponse,
			);
		});

		it('handles no shape result when in shape domain', (done) => {
			requestShapeRecognitionForStrokesThenDo(strokesExample, (shapeCandidates) => {
				expect(shapeCandidates).to.have.length(0);
				done();
			});
			requests[0].respond(
				200,
				{ 'Content-Type': 'application/json' },
				'{"result": null}',
			);
		});

		it('handles result when in text domain', (done) => {
			requestTextRecognitionForStrokesThenDo(strokesExample, (textCandidates) => {
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
			requestTextRecognitionForStrokesThenDo(strokesExample, (textCandidates) => {
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
			requestTextRecognitionForStrokesThenDo(strokesExample, (textCandidates) => {
				expect(textCandidates).to.have.length(1);
				done();
			});
			requests[0].respond(
				200,
				{ 'Content-Type': 'application/json' },
				textResponse,
			);
		});
	});
});
