import { resolve } from 'node:path';
import { Hash, getPackages } from './lib';
import { Bunbun } from '../packages/bunbun';

const $ = new Bunbun({
    readTmpl: async (file: string) =>
        await $.fs.read(`./makelib/templates/${file}`),
    readBTmpl: async (file: string) =>
        await $.fs.readBuffer(`./makelib/templates/${file}`),

    getPackages,
    hash: new Hash(),
    changedPackages: [] as string[],
});

$.fs.cwd = resolve(__dirname, '..');

export { $ };
