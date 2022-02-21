import { createHash } from 'node:crypto';
import { $ } from '..';

const SUM_FILE = './makelib/packages-sum.json';

const packageFiles = (project: string) =>
    `./packages/${project}/(package.json|src/**/*.ts)`;

export class Hash {
    private didRead = false;

    private packages: Record<string, string> = {};

    private hashFile = async (file: string) => {
        const buf = await $.fs.readBuffer(file);

        return createHash('md5')
            .update(buf)
            .digest('hex');
    };

    private hashString = (string: string) => createHash('md5')
        .update(string)
        .digest('hex');

    private readPackage = async (pkg: string) => {
        const files = await $.fs.list(packageFiles(pkg));
        const hashes = await Promise.all(files.map(this.hashFile));

        return this.hashString(
            hashes
                .sort((a, b) => a.localeCompare(b))
                .join(';')
        );
    };

    private read = async () => {
        const json = await $.fs.read(SUM_FILE);
        const data = JSON.parse(json) as Record<string, string>;
        this.packages = data;
    };

    private write = async () => {
        await $.fs.write(
            SUM_FILE,
            JSON.stringify(this.packages),
        );
    };

    getChanged = async (packages: string[]) => {
        if (!this.didRead) {
            await this.read();
        }

        const changed: string[] = [];
        let deleted = 0;

        for (const pkg of packages) {
            const hash = await this.readPackage(pkg);

            if (this.packages[pkg] !== hash) {
                this.packages[pkg] = hash;
                changed.push(pkg);
            }
        }

        const missing = Object.keys(this.packages)
            .filter(item => !packages.includes(item))
            .forEach(item => {
                delete this.packages[item];
                deleted++;
            });

        if (changed || deleted) {
            await this.write();
        }

        return changed;
    };
}
