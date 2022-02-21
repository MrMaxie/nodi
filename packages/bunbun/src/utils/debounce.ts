import { wait } from './wait';

export const debounce = <
    Args extends any[],
    Fn extends (...args: Args) => void,
>(fn: Fn, time: number = 0) => {
    const ctx = {
        isRunning: false,
        nextArguments: false as false | Args,
        type: time > 0 ? 'time' as const : 'promise' as const,
    };

    const noop = () => {};

    const tryRepeat = () => {
        if (ctx.isRunning !== true) {
            return;
        }

        ctx.isRunning = false;

        const { nextArguments } = ctx;
        ctx.nextArguments = false;

        if (nextArguments !== false) {
            debouncedFn(...nextArguments);
        }
    };

    const debouncedFn = ((...args: Args) => {
        if (!ctx.isRunning) {
            ctx.isRunning = true;

            if (ctx.type === 'time') {
                wait(time).catch(noop).finally(tryRepeat);
            } else if (ctx.type === 'promise') {
                Promise.resolve()
                    .then(() => fn(...args))
                    .catch(noop)
                    .finally(tryRepeat);
            }
        } else {
            ctx.nextArguments = args;
        }
    });

    return debouncedFn;
};
