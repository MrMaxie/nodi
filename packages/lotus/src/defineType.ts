export type Declaration<T> = {
    name?: string;
    test: (value: unknown) => boolean;
    cast: (value: unknown) => T;
};

const noValue = Symbol('no-value') as any;

export type Type<T> = {
    name?: string;
    test: (value: unknown) => value is T;
    cast: (value: unknown, defaultValue?: T) => T;
};

export const defineType = <T>(
    description: Declaration<T>,
) => {
    return Object.freeze({
        test: (value: unknown) => description.test(value),
        cast: (value: unknown, defaultValue: T = noValue) => {
            try {
                const result = description.cast(value);
                return result;
            } catch (e) {
                if (defaultValue !== noValue) {
                    return defaultValue;
                }

                const typeName = typeof description.name === 'string'
                    ? ` into ${description.name}`
                    : '';
                const errorBody = `Cannot cast given value${typeName}`;

                if (e instanceof Error) {
                    throw new TypeError(`${errorBody}, reason: ${e.message}`);
                } else if (typeof e === 'string') {
                    throw new TypeError(`${errorBody}, reason: ${e}`);
                } else {
                    throw new TypeError(errorBody);
                }
            }
        },
    }) as unknown as Type<T>;
};
