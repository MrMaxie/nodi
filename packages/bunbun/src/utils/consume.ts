export const consume = <
    Fn extends (...args: any[]) => Promise<any>,
>(fn: Fn) => {
    return (async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (e) {
            throw undefined;
        }
    }) as Fn;
};
