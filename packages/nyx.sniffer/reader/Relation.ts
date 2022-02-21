import * as N from './Node';

enum Type {
    ParentOf = 'parentOf',
    InFile = 'inFile',
    UsedInside = 'usedInside',
    ImportedIn = 'importedIn',
    DeclaredIn = 'declaredIn',
}

enum MemberMod {
    Private = 'private',
    Public = 'public',
    Readonly = 'readonly',
}

type Position = {
    from: number;
    to: number;
};

export type Relation = {
    type: Type.ParentOf;
    a: N.ClassNode;
    b: N.MethodNode | N.MemberNode;
    mod: MemberMod[];
} | {
    type: Type.InFile;
    a: N.Node;
    b: N.FileNode;
    at: Position;
} | {
    type: Type.UsedInside;
    a: N.Node;
    b: N.Node;
    at: Position;
} | {
    type: Type.ImportedIn;
    a: N.ModuleNode | N.FileNode;
    b: N.FileNode;
} | {
    type: Type.DeclaredIn;
    a: N.Node;
    b: N.Node;
    at: Position;
};

// Relation-generators
export const Rg = {
    importedIn: (
        a: N.ModuleNode | N.FileNode,
        b: N.FileNode,
    ) => {
        const rel = {
            type: Type.ImportedIn as const,
            a,
            b,
        };

        a.relations.push(rel);
        b.relations.push(rel);
    },
};
