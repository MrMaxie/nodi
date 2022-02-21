import type { Type } from './Type';

class Caster<T1, T2> {
    constructor(
        readonly sourceType: Type<T1>,
        private caster: (value: T1) => T2,
        readonly targetType: Type<T2>,
    ) {}

    create(value: unknown) {
        this.sourceType.assert(value);
        const result = this.caster(value);
        this.targetType.assert(result);
        return result;
    };
}

export const caster = <T1, T2>(
    source: Type<T1>,
    caster: (value: T1) => T2,
    target: Type<T2>,
) =>
    new Caster(source, caster, target);

export type { Caster };

caster
