import Util from 'node:util';

import { COLOR, TYPE } from './constants';

export const stripColors = (text: string) =>
    text.replace(/\x1b\[[0-9]+m/g, '');

export const colorize = (text: string, color: keyof COLOR) =>
    `${COLOR[color]}${text}${COLOR.reset}`;

export const colorizeAs = (text: string, type: keyof TYPE) =>
    colorize(text, TYPE[type]);

export const format = (message: TemplateStringsArray, ...args: any[]) => {
    const chunks: string[] = [];

    message.forEach((text, i) => {
        chunks.push(text);

        if (i in args) {
            const arg = args[i];

            if (arg && typeof arg === 'string' && /\x1b\[[0-9]+m/g.test(arg)) {
                chunks.push(arg);
                return;
            }

            if (typeof arg === 'function' && Util.inspect(arg) === '[Function (anonymous)]') {
                chunks.push(colorize(String(arg).replace(/^\(\)\s+=>\s+/, ''), 'magenta'));
                return;
            }

            chunks.push(Util.inspect(arg, {
                colors: true,
                depth: 3,
            }));
        }
    });

    return chunks.join('');
};