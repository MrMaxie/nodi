import { format, colorizeAs, colorize, stripColors } from './utils';

type LogTypes = {
    [Name: string]: (...args: any[]) => any;
} & {
    format?: never;
    enable?: never;
    disable?: never;
    print?: never;
};

type Logger<T extends LogTypes> = {
    [Key in keyof T]: (...args: Parameters<T[Key]>) => void;
} & {
    format: typeof format;
    print(...args: Parameters<typeof format>): void;
    enable(): void;
    disable(): void;
};

export const spawnLogger = <T extends LogTypes>(types: T): Logger<T> => {
    let isSilent = false;

    const logger = {
        enable: () => {
            isSilent = false;
        },
        disable: () => {
            isSilent = true;
        },
        format,
        print: (message: TemplateStringsArray, ...args: any[]) => {
            if (isSilent) {
                return;
            }

            console.log(format(message, ...args));
        },
    } as any;

    Object.entries(types).forEach(([name, fn]) => {
        logger[name] = (...args: any[]) => {
            if (!isSilent) {
                console.log(fn(...args));
            }
        };
    });

    return Object.freeze(logger);
};

export const Logger = Object.freeze({
    spawn: spawnLogger,
    format,
    colorize,
    colorizeAs,
    stripColors,
});
