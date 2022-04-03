import type { Type } from './Type';
import { Caster, caster } from './Caster';
import { string } from './types/string';

export class Edge<Source = unknown, Target = unknown> {
    private toTarget: Caster<Source, Target>;

    private toSource: Caster<Target, Source>;

    constructor(
        readonly sourceType: Type<Source>,
        readonly targetType: Type<Target>,
        sourceToTarget:
            | ((value: Source) => Target)
            | Caster<Source, Target>,
        targetToSource:
            | ((value: Target) => Source)
            | Caster<Target, Source>,
    ) {
        this.toTarget = sourceToTarget instanceof Caster
            ? sourceToTarget
            : caster(sourceType, targetType, sourceToTarget);

        this.toSource = targetToSource instanceof Caster
            ? targetToSource
            : caster(targetType, sourceType, targetToSource);
    }

    castToTarget(value: Source) {
        return this.toTarget.cast(value);
    }

    castToSource(value: Target) {
        return this.toSource.cast(value);
    }
}

export const edge = <Source = unknown, Target = unknown>(
    sourceType: Type<Source>,
    targetType: Type<Target>,
    sourceToTarget:
        | ((value: Source) => Target)
        | Caster<Source, Target>,
    targetToSource:
        | ((value: Target) => Source)
        | Caster<Target, Source>,
) =>
    new Edge(sourceType, targetType, sourceToTarget, targetToSource);

