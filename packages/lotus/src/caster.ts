import type { Type } from './Type';

export class Caster<Source = unknown, Target = unknown> {
    constructor(
        readonly sourceType: Type<Source>,
        readonly targetType: Type<Target>,
        private caster: (value: Source) => Target,
    ) {}

    cast(value: Source) {
        this.sourceType.assert(value);
        const result = this.caster(value);
        this.targetType.assert(result);
        return result;
    }
}

export const caster = <T1, T2>(
    source: Type<T1>,
    target: Type<T2>,
    caster: (value: T1) => T2,
) =>
    new Caster(source, target, caster);
