import { $ } from './main';

const readJson = async (file: string) => JSON.parse(
    await $.fs.read(file)
);

const editJson = async (
    file: string,
    editor: (data: Record<string, unknown>) => Record<string, unknown>,
) => {
    await $.fs.edit(file, text => {
        const data = JSON.parse(text);
        return JSON.stringify(editor(data), null, 4);
    });
};

const buildPrepare = $.task('build.prepare', async ctx => {
    const files = Object.entries({
        'tsconfig.json': await ctx.readBTmpl('tsconfig.json'),
        '.npmIgnore': await ctx.readBTmpl('.npmignore'),
    });

    // main package
    const mpkg = await readJson('./package.json');

    for (const pkg of ctx.changedPackages) {
        $.logger.print`Building library: ${pkg}`;

        for (const [file, buffer] of files) {
            await $.consume($.fs.writeBuffer)(`./packages/${pkg}/${file}`, buffer);
        }

        await editJson(`./packages/${pkg}/package.json`, data => ({
            name: `@${mpkg.name}/${pkg}`,
            private: data.private,
            version: data.version,
            main: './build/index.js',
            types: './build/index.d.js',
            license: mpkg.license,
            engines: mpkg.engines,
            author: mpkg.author,
            dependencies: data.dependencies,
            devDependencies: data.devDependencies,
            peerDependencies: data.peerDependencies,
        }));
    }
});

export const build = $.task('build', async ctx => {
    const packages = await ctx.getPackages();
    const changed = await ctx.hash.getChanged(packages);

    ctx.changedPackages = changed;
    $.logger.print`Building ${changed.length} of ${packages.length} packages`;

    if (changed.length) {
        await $.run(buildPrepare);
    }

    const tmpl = {
        badge: await ctx.readTmpl('readmeBadge.md'),
        wipBadge: await ctx.readTmpl('readmeWipBadge.md'),
    };

    const packagesJson = await Promise.all(packages.map(async pkg => ({
        name: pkg,
        pkg: await readJson(`./packages/${pkg}/package.json`),
    })));

    const packagesVersion = packagesJson
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(item => !item.pkg.private)
        .map(item => tmpl.badge
            .replace(/___NAME___/g, item.name || '')
            .replace(/___VERSION___/g, item.pkg.version || '?')
        );

    const packagesWipVersion = packagesJson
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(item => item.pkg.private)
        .map(item => tmpl.wipBadge
            .replace(/___NAME___/g, item.name || '')
            .replace(/___VERSION___/g, item.pkg.version || '?')
        );

    const BEGIN = 'PACKAGE_BADGE_BEGIN';
    const END = 'PACKAGE_BADGE_END';

    await $.fs.edit('./README.md', md => md.replace(
        new RegExp(`${BEGIN}[^]*${END}`, 'g'),
        [
            `${BEGIN}-->`,
            ...packagesVersion,
            '\n---',
            '### WIP\n',
            ...packagesWipVersion,
            `<!--${END}`,
        ].join('\n'),
    ));
});
