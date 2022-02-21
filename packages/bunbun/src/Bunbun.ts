import { EventEmitter } from '@nodi/core';
import { Task, TaskCaller } from './Task';
import { spawnLogger } from './Logger';
import { Fs } from './Fs';
import { Server } from './Server';
import * as Utils from './utils';

type Events<Context> = {
    taskStart: (
        task: string,
        context: Context,
    ) => void;
    taskSuccess: (
        task: string,
        time: number,
        context: Context,
    ) => void;
    taskFail: (
        task: string,
        time: number,
        error: Error,
        context: Context,
    ) => void;
    taskDone: (
        task: string,
        time: number,
        isSuccess: boolean,
        context: Context,
    ) => void;
    error: (
        msg: string,
        context: Context,
    ) => void;
    success: (
        msg: string,
        context: Context,
    ) => void;
    log: (
        msg: string,
        context: Context,
    ) => void;
};

export class Bunbun<Context> extends EventEmitter<Events<Context>> {
    readonly logger = spawnLogger();

    readonly fs = new Fs();
    readonly server: Server<Context> = new Server(this);

    readonly debouce = Utils.debounce;
    readonly exec = Utils.exec(() => this.fs.cwd);
    readonly panic = Utils.panic;
    readonly rescue = Utils.rescue;
    readonly wait = Utils.wait;
    readonly consume = Utils.consume;

    context: Context;

    private tasks: Task<Context>[] = [];

    constructor(context: Context) {
        super();
        this.context = context;

        this.on('taskStart', task => {
            this.logger.taskStart(task);
        });

        this.on('taskSuccess', (task, time) => {
            this.logger.taskSuccess(task, time);
        });

        this.on('taskFail', (task, time, error) => {
            this.logger.taskFail(task, time, error);
        });
    }

    task = (name: string, caller: TaskCaller<Context>) => {
        const task = new Task<Context>(name, caller);

        this.tasks.push(task);

        task.on('start', ctx => {
            this.emit('taskStart', name, ctx);
        });

        task.on('success', (time, ctx) => {
            this.emit('taskSuccess', name, time, ctx);
        });

        task.on('fail', (time, error, ctx) => {
            this.emit('taskFail', name, time, error, ctx);
        });

        task.on('done', (time, isSuccess, ctx) => {
            this.emit('taskDone', name, time, isSuccess, ctx);
        });

        return task;
    };

    run = async (task: Task<Context>) => {
        await task.run(this.context);
    };

    until = (task: Task<Context>) => {
        return new Promise<void>(res => {
            if (!task.isWorking()) {
                return res();
            }

            const listener = () => {
                if (!task.isWorking()) {
                    res();
                    task.off('done', listener);
                }
            };

            task.on('done', listener);
        });
    };

    start = (defaultTask?: Task<Context>) => {
        const taskName = process.argv[2] || '';

        if (taskName) {
            const task = this.tasks.find(t => t.getName() === taskName);

            if (task) {
                this.panic(this.run)(task);
                return;
            }

            this.logger.format`Cannot find task ${taskName}, default task will be used`;
        }

        if (defaultTask) {
            this.panic(this.run)(defaultTask);
            return;
        }

        this.logger.error('Default task isn\'t set');
    };
}