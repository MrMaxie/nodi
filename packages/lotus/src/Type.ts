import { ExternalError } from './errors/ExternalError';
import { UnknownAssertError } from './errors/UnknownAssertError';

type Tester<T> =
    | ((value: unknown) => value is T)
    | ((value: unknown) => boolean);

export class Type<T = unknown, Error extends ExternalError = ExternalError> {
    constructor(
        readonly name: string,
        private tester: Tester<T>,
    ) {}

    assert = (value: unknown): T => {
        if (!this.tester(value)) {
            throw new UnknownAssertError(this.name);
        }

        return value;
    };

    match = (value: unknown): value is T => {
        try {
            const result = this.tester(value);
            return Boolean(result);
        } catch {
            return false;
        }
    };

    tryAssert = (value: unknown, map: {
        [Code: Error<infer Codoe>]
    }) => {

    };
}

export const type = <T>(
    name: string,
    tester: Tester<T>,
): Type<T> =>
    new Type(name, tester);
