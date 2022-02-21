import { createCollection } from './Collection';

const isSafeNumber = (x: unknown): x is number =>
    typeof x === 'number' &&
    !isNaN(x) &&
    x < Number.MAX_SAFE_INTEGER &&
    x > Number.MIN_SAFE_INTEGER;

export const types = createCollection({
    number: {
        test: x => typeof x === 'number',
        cast: x => isSafeNumber(x),
    },
    string: {
        test: x => typeof x === 'string',
        cast: x => String(x),
    },
    array: {
        test: x => Array.isArray(x),
        cast: () => {
            throw new Error('Not implemented');
        },
    },
    object: {
        test: x => typeof x === 'object' && x !== null,
        cast: () => {
            throw new Error('Not implemented');
        },
    },
    bool: {
        test: x => x === !!x,
        cast: x => !!x,
    },
    int: {
        test: x => isSafeNumber(x) && x % 1 === 0,
        cast: x => {
            const r = parseInt(String(x), 10);

            if (!isSafeNumber(r)) {
                throw new Error('Non-int');
            }

            return r;
        },
    },
    positiveInt: {
        test: x => isSafeNumber(x) && x % 1 === 0 && x > 0,
        cast: x => {
            const r = parseInt(String(x), 10);

            if (!isSafeNumber(r)) {
                throw new Error('Non-int result');
            }

            if (r <= 0) {
                throw new Error('Non-positive result')
            }

            return r;
        },
    },
    nonPositiveInt: {
        test: x => isSafeNumber(x) && x % 1 === 0 && x <= 0,
        cast: x => {
            const r = parseInt(String(x), 10);

            if (!isSafeNumber(r)) {
                throw new Error('Non-int result');
            }

            if (r > 0) {
                throw new Error('Positive result');
            }

            return r;
        },
    },
    negativeInt: {
        test: x => isSafeNumber(x) && x % 1 === 0 && x < 0,
        cast: x => {
            const r = parseInt(String(x), 10);

            if (!isSafeNumber(r)) {
                throw new Error('Non-int result');
            }

            if (r >= 0) {
                throw new Error('Non-negative result');
            }

            return r;
        },
    },
    nonNegativeInt: {
        test: x => isSafeNumber(x) && x % 1 === 0 && x >= 0,
        cast: x => {
            const r = parseInt(String(x), 10);

            if (!isSafeNumber(r)) {
                throw new Error('Non-int result');
            }

            if (r < 0) {
                throw new Error('Negative result');
            }

            return r;
        },
    },
});
