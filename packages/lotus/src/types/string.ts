import { type } from '../Type';

export const string = (props: Partial<{
    min: number;
    max: number;
}> = {}) => {
    const { min, max } = Object.assign({
        min: -Infinity,
        max: Infinity,
    }, props);

    return type<string>('string', value => {
        if (typeof value !== 'string') {
            throw new Error('');
        }

        if (value.length < min) {
            throw new Error('');
        }

        if (value.length > max) {
            throw new Error('');
        }

        return true;
    });
};
