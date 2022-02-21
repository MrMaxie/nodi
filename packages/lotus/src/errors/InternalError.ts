export class InternalError extends Error {
    constructor(
        readonly name: string,
    ) {
        super(`Unknown assert error of ${name}`);
    }
}
