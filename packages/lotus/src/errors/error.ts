import { externalError } from './ExternalError';
import { internalError } from './InternalError';

export const error = Object.freeze({
    external: externalError,
    internal: internalError,
});
