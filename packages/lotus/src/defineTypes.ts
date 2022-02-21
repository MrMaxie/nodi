import { defineType, Declaration } from './defineType';

type Types = {
    [K: string]: Declaration<any>;
};

export const defineTypes = <T extends Types>(list: T): T => {
    const c = {} as any;

    for (const entry of Object.entries(list)) {
        c[entry[0]] = defineType({
            name: entry[0],
            test: entry[1].test,
            cast: entry[1].cast,
        });
    }

    return c as T;
};
