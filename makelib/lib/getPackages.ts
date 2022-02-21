import { $ } from '../main';

const BEFORE_GLOB = './packages/';
const AFTER_GLOB = '/package.json';

export const getPackages = async () => {
    const glob = [BEFORE_GLOB, '*', AFTER_GLOB].join('');
    const dirs = await $.fs.list(glob);

    return dirs.map(item => item
        .replace(BEFORE_GLOB, '')
        .replace(AFTER_GLOB, '')
    );
};
