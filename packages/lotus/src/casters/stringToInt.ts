import { caster } from '../Caster';
import { string } from '../types/string';
import { number } from '../types/number';

export const stringToInt = (props: Partial<{
    precision: number;
    radix: number;
    decimalComma: string | RegExp;
    removeChars: string | RegExp;
}>) => {
    const p = Object.assign({
        precision: Infinity,
        radix: 10,
        decimalComma: /[.,]/,
    }, props);

    caster(string(), number(), value => {

    });
};
