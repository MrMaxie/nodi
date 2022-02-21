import { type } from '../Type';

export const number = (props: Partial<{
    min: number;
    max: number;
}> = {}) => {
    const { min, max } = Object.assign({
        min: -Infinity,
        max: Infinity,
    }, props);

    return type<number>('number', value => {
        if (typeof value !== 'number') {
            throw new Error('');
        }

        if (value < min) {
            throw new Error('');
        }

        if (value > max) {
            throw new Error('');
        }

        return true;
    });
};
