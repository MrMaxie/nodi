const ON_LIST = Symbol('event-listeners');
const ONCE_LIST = Symbol('event-listeners-once');

export class EventEmitter<Events extends {
    [Name: string]: any;
} = Record<string, void>> {
    private readonly [ON_LIST]: Partial<{
        [Name in keyof Events]: Array<(...args: Parameters<Events[Name]>) => void>;
    }> = {};

    private readonly [ONCE_LIST]: Partial<{
        [Name in keyof Events]: Array<(...args: Parameters<Events[Name]>) => void>;
    }> = {};

    on<Name extends keyof Events>(name: Name, cb: (...args: Parameters<Events[Name]>) => void) {
        if (!(name in this[ON_LIST])) {
            this[ON_LIST][name] = [];
        }

        this[ON_LIST][name]!.push(cb);
    }

    once<Name extends keyof Events>(name: Name, cb: (...args: Parameters<Events[Name]>) => void) {
        if (!(name in this[ONCE_LIST])) {
            this[ONCE_LIST][name] = [];
        }

        this[ONCE_LIST][name]!.push(cb);
    }

    off<Name extends keyof Events>(name: Name, cb?: (...args: Parameters<Events[Name]>) => void) {
        const arr1 = this[ON_LIST][name];
        const arr2 = this[ONCE_LIST][name];

        if (arr1) {
            if (cb === undefined) {
                this[ON_LIST][name] = [];
            } else {
                const i1 = arr1.indexOf(cb);

                if (i1 !== -1) {
                    arr1.splice(i1, 1);
                }
            }
        }

        if (arr2) {
            if (cb === undefined) {
                this[ONCE_LIST][name] = [];
            } else {
                const i2 = arr2.indexOf(cb);

                if (i2 !== -1) {
                    arr2.splice(i2, 1);
                }
            }
        }
    }

    emit<Name extends keyof Events>(name: Name, ...args: Parameters<Events[Name]>) {
        const arr1 = this[ON_LIST][name];
        const arr2 = this[ONCE_LIST][name];

        let i = 0;

        if (arr1) {
            for (i = 0; i < arr1.length; i++) {
                arr1[i](...args);
            }
        }

        if (arr2) {
            for (i = 0; i < arr2.length; i++) {
                arr2[i](...args);
            }
            this[ONCE_LIST][name] = [];
        }
    }
}
