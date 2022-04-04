import { Type } from '../Type';

export class ExternalError<Code extends string, Params> extends Error {
    constructor(
        readonly code: Code,
        readonly params: Params,
    ) {
        super(`${code}, params: ${params}`);
    }
}

// export type ErrorCode<E> = E extends ExternalError<infer Code, infer Params> ?

type ExternalErrorTemplate<Code extends string, Params> = unknown extends Params ? {
    new(): ExternalError<Code, Params>;
} : {
    new(params: Params): ExternalError<Code, Params>;
};

export const externalError = <
    Code extends string,
    Params extends Record<string, unknown>,
>(code: Code, defaultParams: Params = {}) => class extends ExternalError<Code, Params> {
    constructor(params: Params) {
        super(code, params);
    }
} as unknown as ExternalErrorTemplate<Code, Params>;

const TestError = externalError('test_error', { a: 2, b: '' });
new TestError({ a: 10, b: '' });
const TestError2 = externalError('test_error_2');
new TestError2();

const list = [
    TestError,
    TestError2,
];

type Codes = InstanceType<(typeof list)[number]>['code'];

