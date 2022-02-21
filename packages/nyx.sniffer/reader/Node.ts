import { Relation } from './Relation';

export enum NodeType {
    Class = 'class',
    File = 'file',
    Module = 'module',
    Member = 'member',
    Method = 'method',
    Function = 'function',
    Type = 'type',
    Interface = 'interface',
    Var = 'var',
};

let i = 0;

export abstract class Node {
    readonly type: NodeType;

    name: string;
    index: number;
    relations: Relation[] = [];

    constructor() {
        i += 1;
        this.index = i;
    }
}

export class ClassNode extends Node {
    type = NodeType.Class as const;
}

export class FileNode extends Node {
    type = NodeType.File as const;
}

export class ModuleNode extends Node {
    type = NodeType.Module as const;
}

export class MemberNode extends Node {
    type = NodeType.Member as const;
}

export class MethodNode extends Node {
    type = NodeType.Method as const;
}

export class FunctionNode extends Node {
    type = NodeType.Function as const;
}

export class TypeNode extends Node {
    type = NodeType.Type as const;
}

export class InterfaceNode extends Node {
    type = NodeType.Interface as const;
}

export class VarNode extends Node {
    type = NodeType.Var as const;
}