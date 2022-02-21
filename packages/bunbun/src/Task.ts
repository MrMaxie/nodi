import { EventEmitter } from '@nodi/core';

export type TaskCaller<Context> = (context: Context) => void;

type Events<Context> = {
    start: (
        context: Context,
    ) => void;
    success: (
        time: number,
        context: Context,
    ) => void;
    fail: (
        time: number,
        error: Error,
        context: Context,
    ) => void;
    done: (
        time: number,
        isSuccess: boolean,
        context: Context,
    ) => void;
};

export class Task<Context> extends EventEmitter<Events<Context>> {
    private workingCount = 0;

    constructor(
        private name: string,
        private caller: TaskCaller<Context>,
    ) {
        super();
    }

    isWorking = () => this.workingCount > 0;

    getName = () => this.name;

    run = async (ctx: Context) => {
        this.emit('start', ctx);

        this.workingCount += 1;
        let startTime = Date.now();
        let doneTime = Date.now();
        let result = true;

        await Promise.resolve()
            .then(() => {
                try {
                    return this.caller(ctx);
                } catch (err) {
                    return Promise.reject(err);
                }
            })
            .then(() => {
                doneTime = Date.now() - startTime;
                this.emit('success', doneTime, ctx);
                this.workingCount =- 1;
                this.emit('done', doneTime, true, ctx);
            })
            .catch(err => {
                doneTime = Date.now() - startTime;
                this.emit('fail', doneTime, err, ctx);
                this.workingCount =- 1;
                this.emit('done', doneTime, false, ctx);
                result = false;
            });

        return result
            ? Promise.resolve()
            : Promise.reject();
    };
}
