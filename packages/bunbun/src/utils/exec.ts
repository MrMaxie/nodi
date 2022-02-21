type StdioType = 'inherit' | 'string';

type Result = {
    stdout: string | undefined;
    stderr: string | undefined;
    exitCode: number;
};

const defaultOptions = {
    timeout: 0,
    stdout: 'string' as StdioType,
    stderr: 'string' as StdioType,
    useShell: false,
    rescue: false,
};

export const exec = (cwdGetter: () => string) => async (
    command: string,
    args: string[] = [],
    options: Partial<typeof defaultOptions> = {},
): Promise<Result> => {
    const opts = {...defaultOptions, ...options};

    const { execa } = await new Function('x', 'return import(x);')('execa');
    const data = await execa(command, args, {
        timeout: opts.timeout,
        stdout: opts.stdout === 'string' ? undefined : 'inherit',
        stderr: opts.stderr === 'string' ? undefined : 'inherit',
        reject: false,
        cwd: cwdGetter(),
        shell: opts.useShell,
    });

    const result = {
        stdout: opts.stdout === 'string' ? (data.stdout || '') : undefined,
        stderr: opts.stderr === 'string' ? (data.stderr || '') : undefined,
        exitCode: data.exitCode,
    };

    if (data.exitCode !== 0 && opts.rescue === false) {
        throw new Error('Executed command failed');
    }

    return result;
};