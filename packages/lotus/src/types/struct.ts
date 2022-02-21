import { type, Type } from '../Type';

type Struct = {
    [key: string]:
        | Struct
        | Type<unknown>;
};

export const struct: Type<Struct> = type('struct', value => {
    if (typeof value !== 'object' || value === null) {
        throw new Error('');
    }

    for (const sub of Object.values(value)) {
        if (sub instanceof Type) {
            continue;
        }

        struct.assert(sub);
        continue;
    }

    return true;
});
