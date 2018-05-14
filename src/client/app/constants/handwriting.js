// @flow
import credentials from 'credentials/myscriptjs.json';

export const APPLICATION_KEY = credentials.applicationKey;

export const HMAC_KEY = credentials.hmacKey;

export const TEXT_RECOGNITION_URL = 'https://cloud.myscript.com/api/v3.0/recognition/rest/text/doSimpleRecognition.json';

export const SHAPE_RECOGNITION_URL = 'https://cloud.myscript.com/api/v3.0/recognition/rest/shape/doSimpleRecognition.json';

export const LANGUAGE = 'en_US';

export const TEXT_INPUT_MODE = 'CURSIVE';

export const TEXT_INPUT_TYPE = 'MULTI_LINE_TEXT';

export const CANDIDATES_COUNT = 5;
