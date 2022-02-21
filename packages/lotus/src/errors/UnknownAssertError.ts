export class UnknownAssertError extends Error {
    constructor(
        readonly name: string,
    ) {
        super(`Unknown assert error of ${name}`);
    }
}
