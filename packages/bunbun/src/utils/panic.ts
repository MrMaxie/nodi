export const panic = <
    Fn extends (...args: any[]) => Promise<any>,
>(fn: Fn) => {
    return (async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (e) {
            if (e) {
                console.error(e);
            }
            process.exit(1);
        }
    }) as Fn;
};
