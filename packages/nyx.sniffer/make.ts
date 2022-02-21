import Bunbun from 'bunbun';
import * as Path from 'node:path';
import * as Esbuild from 'esbuild';

const $ = new Bunbun();

$.fs.cwd = __dirname;

$.task('start', async () => {
    Esbuild.serve({
        'port': 80,
        'servedir': './public',
    }, {
        'publicPath': './',
        'entryPoints': ['./src/index.ts'],
        'format': 'esm',
        'splitting': true,
        'outdir': './public',
        'bundle': true,
        'minify': true,
        sourcemap: true,
    });
});

$.task('generate', async () => {
    const projectPath = '';
    const entryFile = 'src/index.tsx';

    const project = new Project({
        tsConfigFilePath: `${projectPath}/tsconfig.json`,
        skipAddingFilesFromTsConfig: true,
    });

    project.addDirectoryAtPath(projectPath);
    project.addSourceFilesFromTsConfig(`${projectPath}/tsconfig.json`);
    project.addSourceFilesAtPaths(`${projectPath}/**/*.{ts,d.ts,tsx}`);

    type Ctx = {
        file: string;
        id: string;
        type: string;
        position: {
            start: number;
            end: number;
        };
        refs: Array<{
            file: string;
            position: {
                start: number;
                end: number;
            };
        }>;
    };

    const ctxs: Ctx[] = [];

    const genCtxName = (type: string, value?: string) => {
        if (!value) {
            return `${type} #${ctxs.length + 1}`;
        }

        return `${type} ${value}|${ctxs.length + 1}`;
    };

    const data: {
        nodes: Array<{
            id: string;
            file: string;
            isModule?: boolean;
            isFirst?: boolean;
            type?: string;
        }>;
        edges: Array<{
            a: string;
            b: string;
        }>
    } = {
        nodes: [],
        edges: [],
    };

    const importedModules = new Set<string>();
    const usedFiles = new Set<string>();
    const nextFiles = new Set<string>([`${projectPath}/${entryFile}`]);
    let isFirst = true;

    do {
        const filePath = [...nextFiles].find(() => true);

        if (!filePath) {
            continue;
        }

        if (usedFiles.has(filePath)) {
            nextFiles.delete(filePath);
            continue;
        }

        data.nodes.push({
            id: Path.relative(projectPath, filePath),
            isModule: false,
            isFirst,
            type: 'file',
            file: Path.relative(projectPath, filePath),
        });

        isFirst = false;

        nextFiles.delete(filePath);
        usedFiles.add(filePath);

        const addEdge = (target?: string | undefined) => {
            if (!target || usedFiles.has(target)) {
                return;
            }

            data.edges.push({
                a: Path.relative(projectPath, filePath),
                b: target,
            });
        };

        try {
            const sourceFile = project.getSourceFileOrThrow(filePath);

            $.logger.log('@$', Path.relative(projectPath, filePath));

            sourceFile.getImportDeclarations().forEach(importItem => {
                const importName = importItem.getModuleSpecifierValue();
                const importPath = importItem.getModuleSpecifierSourceFile()?.getFilePath() || '';

                if (!/node_modules/i.test(importPath)) {
                    return;
                }

                addEdge(importName);
                importedModules.add(importName);
            });

            sourceFile.getReferencedSourceFiles().forEach(sourceFileItem => {
                const path = sourceFileItem.getFilePath();

                if (/node_modules/i.test(path) || !path) {
                    return;
                }

                nextFiles.add(path);
                addEdge(Path.relative(projectPath, path));
            });

            sourceFile.getClasses().forEach(classItem => {
                ctxs.push({
                    file: filePath,
                    id: genCtxName('class', classItem.getName()),
                    type: 'class',
                    position: {
                        start: classItem.getStart(),
                        end: classItem.getEnd(),
                    },
                    refs: classItem.findReferencesAsNodes().map(refNode => ({
                        file: refNode.getSourceFile?.().getFilePath() || '',
                        position: {
                            start: refNode.getStart(),
                            end: refNode.getEnd(),
                        },
                    })),
                });

                classItem.getInstanceMembers().forEach(memberItem => {
                    ctxs.push({
                        file: filePath,
                        id: genCtxName('member', memberItem.getName()),
                        type: 'member',
                        position: {
                            start: memberItem.getStart(),
                            end: memberItem.getEnd(),
                        },
                        refs: [
                            ...memberItem.findReferencesAsNodes().map(refNode => ({
                                file: refNode.getSourceFile?.().getFilePath() || '',
                                position: {
                                    start: refNode.getStart(),
                                    end: refNode.getEnd(),
                                },
                            })),
                            {
                                file: filePath,
                                position: {
                                    start: classItem.getStart(),
                                    end: classItem.getEnd(),
                                },
                            }
                        ],
                    });
                });

                classItem.getMethods().forEach(methodItem => {
                    ctxs.push({
                        file: filePath,
                        id: genCtxName('method', methodItem.getName()),
                        type: 'method',
                        position: {
                            start: methodItem.getStart(),
                            end: methodItem.getEnd(),
                        },
                        refs: [
                            ...methodItem.findReferencesAsNodes().map(refNode => ({
                                file: refNode.getSourceFile?.().getFilePath() || '',
                                position: {
                                    start: refNode.getStart(),
                                    end: refNode.getEnd(),
                                },
                            })),
                            {
                                file: filePath,
                                position: {
                                    start: classItem.getStart(),
                                    end: classItem.getEnd(),
                                },
                            }
                        ],
                    });
                });
            });

            sourceFile.getFunctions().forEach(functionItem => {
                ctxs.push({
                    file: filePath,
                    id: genCtxName('function', functionItem.getName()),
                    type: 'function',
                    position: {
                        start: functionItem.getStart(),
                        end: functionItem.getEnd(),
                    },
                    refs: functionItem.findReferencesAsNodes().map(refNode => ({
                        file: refNode.getSourceFile?.().getFilePath() || '',
                        position: {
                            start: refNode.getStart(),
                            end: refNode.getEnd(),
                        },
                    })),
                });
            });

            sourceFile.getTypeAliases().forEach(typeAlias => {
                ctxs.push({
                    file: filePath,
                    id: genCtxName('type_alias', typeAlias.getName()),
                    type: 'type_alias',
                    position: {
                        start: typeAlias.getStart(),
                        end: typeAlias.getEnd(),
                    },
                    refs: typeAlias.findReferencesAsNodes().map(refNode => ({
                        file: refNode.getSourceFile?.().getFilePath() || '',
                        position: {
                            start: refNode.getStart(),
                            end: refNode.getEnd(),
                        },
                    })),
                });
            });

            sourceFile.getInterfaces().forEach(interfaceItem => {
                ctxs.push({
                    file: filePath,
                    id: genCtxName('interface', interfaceItem.getName()),
                    type: 'interface',
                    position: {
                        start: interfaceItem.getStart(),
                        end: interfaceItem.getEnd(),
                    },
                    refs: interfaceItem.findReferencesAsNodes().map(refNode => ({
                        file: refNode.getSourceFile?.().getFilePath() || '',
                        position: {
                            start: refNode.getStart(),
                            end: refNode.getEnd(),
                        },
                    })),
                });
            });

            sourceFile.getVariableDeclarations().forEach(varItem => {
                ctxs.push({
                    file: filePath,
                    id: genCtxName('var', varItem.getName()),
                    type: 'var',
                    position: {
                        start: varItem.getStart(),
                        end: varItem.getEnd(),
                    },
                    refs: varItem.findReferencesAsNodes().map(refNode => ({
                        file: refNode.getSourceFile?.().getFilePath() || '',
                        position: {
                            start: refNode.getStart(),
                            end: refNode.getEnd(),
                        },
                    })),
                });
            });
        } catch (e) {
            // swallow
        }

    } while(nextFiles.size > 0);

    data.nodes.push(...[...importedModules].map(id => ({
        id,
        isModule: true,
        file: `node_modules\\~${id}`,
    })));

    ctxs.forEach(el => {
        data.nodes.push({
            id: el.id,
            type: el.type,
            file: el.file,
        });

        data.edges.push({
            a: el.id,
            b: Path.relative(projectPath, el.file),
        });

        el.refs.forEach(ref => {
            ctxs.filter(el2 =>
                el2.id !== el.id &&
                el2.file === ref.file &&
                el2.position.start <= ref.position.start &&
                el2.position.end >= ref.position.end
            ).forEach(el2 => {
                data.edges.push({
                    a: el.id,
                    b: el2.id,
                });
            });
        });
    });

    const usedEdges = new Set<string>();

    data.edges = data.edges.filter(item => {
        const edgeIdA = `${item.a}<~>${item.b}`;
        const edgeIdB = `${item.a}<~>${item.b}`;

        if (usedEdges.has(edgeIdA) || usedEdges.has(edgeIdB)) {
            return false;
        }

        usedEdges.add(edgeIdA);
        usedEdges.add(edgeIdB);

        return true;
    });

    await $.fs.write('./src/data_mine.json', JSON.stringify({ ...data }));
});

$.start('start');

