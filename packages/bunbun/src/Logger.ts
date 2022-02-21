import Util from 'util';
import { Logger } from '@nodi/core';

const formatTime = (time: number) => {
    const ms = Math.floor((time % 1000) / 10);
    const s = Math.floor(time / 1000) % 60;
    const m = Math.floor((time / 1000) / 60);

    const strMs = `00${ms}`.slice(-2);
    const strS = `00${s}`.slice(-2);

    return Logger.colorize(m > 0 ? `${m}:${strS}.${strMs}` : `${strS}.${strMs}`, 'yellow');
};

const cy = (value: string) => Logger.colorize(value, 'yellow');
const cs = (value: string) => Logger.colorizeAs(value, 'success');
const ce = (value: string) => Logger.colorizeAs(value, 'error');
const ci = (value: string) => Logger.colorizeAs(value, 'info');

export const spawnLogger = () => Logger.spawn({
    taskStart: (task: string) =>
        `${cy('~')} [${cy(task)}] Start`,
    taskSuccess: (task: string, time: number) =>
        `${cs('✓')} [${cs(task)}] Done (${formatTime(time)})`,
    taskFail: (task: string, time: number, error?: Error) => {
        const result = `${ce('⨉')} [${ce(task)}] Done (${formatTime(time)})`;

        return error
            ? `${result}, reason:\n ${Logger.format`${error}`}`
            : result;
    },

    success: (msg: string) => `${cs('✓')} ${msg}`,
    log: (msg: string) => `${ci('*')} ${msg}`,
    error: (msg: string) => `${ce('⨉')} ${msg}`,
});
