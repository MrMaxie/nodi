import Path from 'node:path';
import Fse from 'fs-extra';
import Chokidar from 'chokidar';
import { Bunbun } from './Bunbun';

type RemoveOpts = {
    attempts: [count: number, timeout: number];
};

export class Fs<Context> {
    cwd = process.cwd();

    constructor(private $: Bunbun<Context>) {}

    resolve = (...path: string[]) =>
        Path.resolve(this.cwd, '.', ...path);

    copy = async (source: string, target: string) => {
        await Fse.copy(
            this.resolve(source),
            this.resolve(target),
            {
                overwrite: true,
                recursive: true,
            },
        );
    };

    ensureDir = async (path: string) => {
        await Fse.ensureDir(this.resolve(path));
    };

    edit = async (path: string, editor: (source: string) => string | Promise<string>) => {
        const source = await this.read(this.resolve(path));
        const result = await editor(source);
        await this.write(path, result);
    };

    exists = async (path: string, type: 'any' | 'file' | 'dir' = 'any') => {
        const exists = await Fse.pathExists(this.resolve(path));

        if (!exists) {
            return false;
        }

        if (type === 'any') {
            return true;
        }

        try {
            const stats = await Fse.stat(path);

            if (type === 'file' && stats.isFile()) {
                return true;
            }

            if (type === 'dir' && stats.isDirectory()) {
                return true;
            }
        } catch (e) {}

        return false;
    };

    list = async (patterns: string | string[]): Promise<string[]> => {
        const { globby } = await (new Function('x', 'return import(x);'))('globby');

        return await globby(patterns, {
            cwd: this.cwd,
            suppressErrors: true,
        });
    };

    read = async (path: string) => {
        return await Fse.readFile(this.resolve(path), 'utf-8');
    };

    readBuffer = async (path: string) => {
        return await Fse.readFile(this.resolve(path));
    };

    remove = async (path: string, opts: Partial<RemoveOpts> = {}) => {
        const fopts = Object.assign({
            attempts: [5, 350],
        }, opts) as RemoveOpts;

        const maxAttempts = Math.max(fopts.attempts[0] || 1, 1);
        let lastError: unknown;

        for (let i = 0; i < maxAttempts; i++) {
            try {
                await Fse.remove(this.resolve(path));
                return;
            } catch (e) {
                lastError = e;
                await this.$.wait(fopts.attempts[1]);
            }
        }

        throw lastError;
    };

    rename = async (source: string, target: string) => {
        await Fse.move(
            this.resolve(source),
            this.resolve(target),
            { overwrite: true, },
        );
    };

    move = async (source: string, target: string) => {
        await this.rename(source, target);
    };

    watch = (patterns: string | string[], fn: (path: string) => void) => {
        const watcher = Chokidar.watch(patterns, {
            cwd: this.cwd,
            ignoreInitial: true,
        });

        watcher
            .on('add', path => fn(path))
            .on('change', path => fn(path))
            .on('unlink', path => fn(path));

        return async () => {
            try {
                await watcher.close();
            } catch (e) {}
        };
    };

    write = async (path: string, data: string) => {
        await Fse.writeFile(this.resolve(path), data, { encoding: 'utf-8' });
    };

    writeBuffer = async (path: string, data: Buffer) => {
        await Fse.writeFile(this.resolve(path), data);
    };
}
