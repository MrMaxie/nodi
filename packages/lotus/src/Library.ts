import { Caster } from './Caster';
import { Edge } from './Edge';
import { Type } from './Type';

type ListOf<T> = { [Name: string]: () => T; };
type ListOfType = ListOf<Type>;
type ListOfCaster = ListOf<Caster>;
type ListOfEdges = ListOf<Edge>;

export default class Library<
    Types extends ListOfType = {},
    Casters extends ListOfCaster = {},
    Edges extends ListOfEdges = {},
> {
    type: Types;

    caster: Casters;

    edges: Edges;

    constructor(params: Partial<{
        types: Types;
        casters: Casters;
        edges: Edges;
    }>) {
        this.type = Object.freeze(params.types || {}) as Types;
        this.caster = Object.freeze(params.casters || {}) as Casters;
        this.edges = Object.freeze(params.edges || {}) as Edges;
    }
}

export const library = <
    Types extends ListOfType = {},
    Casters extends ListOfCaster = {},
    Edges extends ListOfEdges = {},
>(params: Partial<{
    types: Types;
    casters: Casters;
    edges: Edges;
}>) =>
    new Library(params);
