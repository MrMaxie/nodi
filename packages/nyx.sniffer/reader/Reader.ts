import * as Path from 'node:path';
import { ImportDeclaration, Project } from 'ts-morph';
import { FileNode, Node, ModuleNode } from './Node';
import { Rg } from './Relation';

type FilePath = {
    node: FileNode;
    abs: string;
    rel: string;
};

export class Reader {
    nodes: Node[] = [];

    filesQueue: FilePath[] = [];

    project: Project;

    constructor(
        readonly projectDir: string,
        readonly relativeEntryFile: string,
    ) {
        const project = new Project({
            tsConfigFilePath: `${projectDir}/tsconfig.json`,
            skipAddingFilesFromTsConfig: true,
        });

        this.project = project;

        project.addDirectoryAtPath(projectDir);
        project.addSourceFilesFromTsConfig(`${projectDir}/tsconfig.json`);
        project.addSourceFilesAtPaths(`${projectDir}/**/*.{ts,d.ts,tsx}`);

        this.enqueueFile(`${projectDir}/${relativeEntryFile}`);
    }

    enqueueFile = (file: string) => {
        const node = new FileNode();

        this.filesQueue.push({
            node,
            abs: Path.resolve(this.projectDir, file),
            rel: Path.relative(this.projectDir, file),
        });

        return node;
    };

    start = () => {
        while (true) {
            const file = this.filesQueue.pop();

            if (!file) {
                break;
            }

            this.nextFile(file);
        }
    };

    nextFile = (file: FilePath) => {
        file.node.name = file.rel;
        this.nodes.push(file.node);

        const sourceFile = this.project
            .getSourceFileOrThrow(file.abs);
        sourceFile
            .getImportDeclarations();
            // .forEach(this.parseImport(file.node));

        sourceFile.getReferencingSourceFiles().forEach(item => {
            console.log(item.getFilePath());
        });
    };

    private parseImport = (parent: FileNode) => (item: ImportDeclaration) => {
        const isModule = item
            .getModuleSpecifierSourceFile()
            ?.isInNodeModules() === true;
        const name = item
            .getModuleSpecifierValue();
        const path = item
            .getModuleSpecifierSourceFile()
            ?.getFilePath() || '';

        if (isModule) {
            const node = new ModuleNode();
            node.name = name;

            Rg.importedIn(node, parent);
            return;
        }

        if (!path) {
            console.log(item, item.getFullText());
            process.exit(1);
        }

        console.log('enquering', path);
        const node = this.enqueueFile(path);
        Rg.importedIn(node, parent);
    };
}