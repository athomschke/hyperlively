import myScriptJs from 'sagas/myScriptJs';
import { requestTextCandidates } from 'actions/handwritingRecognition';
import { strokesExample, textResponse, shapeResponse } from '../data';

describe('MyScriptJS Sagas', () => {
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

	describe('Running sagas', () => {
		const sagas = [];
		beforeEach(() => {
			const sagaGenerator = myScriptJs();
			let saga = sagaGenerator.next();
			while (saga.value) {
				sagas.push(saga);
				saga = sagaGenerator.next();
			}
		});

		it('creates two myScriptJs sagas', () => {
			expect(sagas).to.have.length(2);
		});

		it('requests text candidates from myscript.js', () => {
			const textFetchGenerator = sagas[0].value.FORK.args[1](requestTextCandidates(strokesExample));
			expect(textFetchGenerator.next().value.CALL.args[0]).to.deep.equal(strokesExample);
		});

		it('requests shape candidates from myscript.js', () => {
			const textFetchGenerator = sagas[1].value.FORK.args[1](requestTextCandidates(strokesExample));
			expect(textFetchGenerator.next().value.CALL.args[0]).to.deep.equal(strokesExample);
		});
	});

	describe('Fetching text candidates', () => {
		it.skip('fetches and receive results for shape recognition', (done) => {
			let dispatchedAction;
			const dispatch = (action) => {
				dispatchedAction = action;
			};
			const strokes = strokesExample;
			const asynchronousFunction = fetchShapeCandidates(strokes);
			const checkFinalAction = () => {
				expect(dispatchedAction.type).to.equal('RECEIVE_SHAPE_CANDIDATES');
				done();
			};
			const checkIntermediateAction = () => {
				expect(dispatchedAction.type).to.equal('REQUEST_SHAPE_CANDIDATES');
			};
			asynchronousFunction(dispatch).then(checkFinalAction);
			expect(requests).to.have.length(1);
			checkIntermediateAction();
			requests[0].respond(
				200,
				{ 'Content-Type': 'application/json' },
				shapeResponse,
			);
		});
	})
})