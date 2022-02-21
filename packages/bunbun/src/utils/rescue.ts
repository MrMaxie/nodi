export const rescue = <
    Result,
    Fn extends (...args: any[]) => Promise<Result>,
>(fn: Fn, alt?: Result) => {
    return (async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (e) {
            return alt;
        }
    }) as Fn;
};
