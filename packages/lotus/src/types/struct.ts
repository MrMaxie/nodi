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





const x = {
    type: {
        a: 10,
        b: 'str',
    },
};

const structX = struct({
    type: {
        a: number({ min: 10, max: 120 }),
        b: string(5),
    },
});

structX.matchAssert(x, {
    'not_string': () => console.log('huehue'),
    'invalid_length_string': (path: string, { min, current }) => console.log('hihi', min, current),
});

const holder = structX.createErrorHolder();

Struct.getError(holder.type); // type -> ok!
Struct.getError(holder.type.a); // type.a -> o nie! ''
Struct.getError(holder.type.b); // type.b -> 










