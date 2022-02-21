import fs from 'node:fs/promises';
import { Logger } from '@nodi/core';
import { isPromise } from 'node:util/types';

class Nyx {
    currentScope: string[] = [];

    tests: Array<{
        name: string;
        scope: string[];
        fn: () => void | Promise<void>;
    }> = [];

    scope = (
        description: string,
        fn: () => void,
    ) => {
        this.currentScope.push(description);
        fn();
        this.currentScope.pop();
    };

    it = <T>(context: T | Promise<T>) => (name: string, fn: (context: T) => void | Promise<void>) => {
        this.tests.push({
            name,
            scope: [...this.currentScope],
            fn: fn.bind(undefined, context),
        });
    };

    run = (name: string, scope?: string[]) => {
        const test = this.tests.find(scope
            ? (x => x.name === name && scope.join('-') === x.scope.join('-'))
            : (x => x.name === name)
        );

        if (test) {
            test.fn();
        }
    };

    runDebugger = async () => {
        /*
        const cri = await Cri({
            port: 9229,
        });

        const { Debugger, Runtime } = cri;

        await Debugger.enable({});
        await Runtime.enable();

        await Debugger.setBreakpointsActive({
            active: true,
        });

        let omitted = 0;

        Debugger.on('paused', async e => {
            console.log('debugger =>', e);
            if (omitted === 0) {
                await Debugger.stepOut();
            } else {
                const objsIds = new Set<string>();
                const objs: any = {};

                for (const frame of e.callFrames) {
                    for (const scope of frame.scopeChain) {
                        if (scope.type === 'global') {
                            continue;
                        }

                        if (scope.object.objectId) {
                            objsIds.add(scope.object.objectId);
                        }
                    }
                }

                for (const objId of objsIds) {
                    const obj = await Runtime.getProperties({
                        objectId: objId,
                    });
                    objs[objId] = JSON.parse(JSON.stringify(obj));
                }

                await fs.writeFile('./callStack.json', JSON.stringify({ ...e, objs }, null, 4), { encoding: 'utf-8' });
            }
            omitted += 1;
        });

        Runtime.on('consoleAPICalled', ce => {
            console.log('console =>', ce);
        });

        await Debugger.resume({});
        */
    };
}

export const nyx = new Nyx();

export const scope = nyx.scope;
export const it = (name: string, fn: () => void | Promise<void>) => {
    const universalIt = nyx.it(undefined);
    universalIt(name, fn);
};
export const setup = <T>(contextGenerator: () => Promise<T> | T) => {
    return {
        it: nyx.it(contextGenerator()),
    };
};

type Test = () => Promise<unknown> | unknown;
type MessageMaker = (format: typeof Logger['format']) => string;

class AssertionError extends Error {}

export const assert = async (test: Test, messageMaker?: MessageMaker) => {
    await Promise.resolve()
        .then(() => {
            const res = test();

            if (isPromise(res)) {
                return res;
            }

            if (res) {
                return;
            }

            return res ? true : Promise.reject(new AssertionError(Logger.format`Assertion ${test} failed`));
        })
        .catch(err => {
            if (messageMaker) {
                throw new AssertionError(messageMaker(Logger.format));
            }

            throw err;
        });
};
