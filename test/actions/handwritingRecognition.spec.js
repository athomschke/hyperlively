import { requestTextCandidates, requestShapeCandidates, receiveTextCandidates, receiveShapeCandidates, fetchTextCandidates, fetchShapeCandidates } from 'src/client/app/actions/handwritingRecognition';
import { strokesExample, textResponse, shapeResponse } from 'test/data';

describe('src/client/app/actions', () => {
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

	it('Should create an action to request a text candidate', () => {
		const strokes = strokesExample;
		const expectedAction = {
			type: 'REQUEST_TEXT_CANDIDATES',
			strokes,
		};
		expect(requestTextCandidates(strokes)).to.deep.equal(expectedAction);
	});

	it('Should create an action to request a shape candidate', () => {
		const strokes = strokesExample;
		const expectedAction = {
			type: 'REQUEST_SHAPE_CANDIDATES',
			strokes,
		};
		expect(requestShapeCandidates(strokes)).to.deep.equal(expectedAction);
	});

	it('Should create an action to receive a text candidate', () => {
		const candidates = {
			textSegmentResult: {
				selectedCandidateIdx: 0,
				candidates: [],
			},
		};
		const expectedAction = {
			type: 'RECEIVE_TEXT_CANDIDATES',
			candidates,
		};
		expect(receiveTextCandidates(candidates)).to.deep.equal(expectedAction);
	});

	it('Should create an action to receive a shape candidate', () => {
		const candidates = {
			segments: [],
		};
		const expectedAction = {
			type: 'RECEIVE_SHAPE_CANDIDATES',
			candidates,
		};
		expect(receiveShapeCandidates(candidates)).to.deep.equal(expectedAction);
	});

	it.skip('Should be able to asynchronously fetch and receive results for text recognition', (done) => {
		let dispatchedAction;
		const dispatch = (action) => {
			dispatchedAction = action;
		};
		const strokes = strokesExample;
		const asynchronousFunction = fetchTextCandidates(strokes);
		const checkFinalAction = () => {
			expect(dispatchedAction.type).to.equal('RECEIVE_TEXT_CANDIDATES');
			done();
		};
		const checkIntermediateAction = () => {
			expect(dispatchedAction.type).to.equal('REQUEST_TEXT_CANDIDATES');
		};
		asynchronousFunction(dispatch).then(checkFinalAction);
		expect(requests).to.have.length(1);
		checkIntermediateAction();
		requests[0].respond(
			200,
			{ 'Content-Type': 'application/json' },
			textResponse,
		);
	});

	it.skip('Should be able to asynchronously fetch and receive results for shape recognition', (done) => {
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
});
