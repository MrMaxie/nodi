import { Type } from '../Type';

export class ExternalError extends Error {
    constructor(
        readonly type: Type,
        readonly reason: string,
        readonly readonCode: string,
    ) {
        super(`Unknown assert error of ${name}`);
    }
}
