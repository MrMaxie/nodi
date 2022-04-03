import { type } from '../Type';

const isSafeNumber = (x: unknown): x is number =>
    typeof x === 'number' &&
    !isNaN(x) &&
    x < Number.MAX_SAFE_INTEGER &&
    x > Number.MIN_SAFE_INTEGER;

export const number = (props: Partial<{
    min: number;
    max: number;
    precision: number;
    safe: boolean;
}> = {}) => {
    const { min, max, precision, safe } = Object.assign({
        min: -Infinity,
        max: Infinity,
        precision: Infinity,
        safe: true,
    }, props);

    return type<number>('number', value => {
        if ((safe && !isSafeNumber(value)) || typeof value !== 'number') {
            throw new Error('');
        }

        if (value < min) {
            throw new Error('');
        }

        if (value > max) {
            throw new Error('');
        }

        if (precision !== Infinity && String(value % 1).length - 2 >= precision) {
            throw new Error('');
        }

        return true;
    });
};
