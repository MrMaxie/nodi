const createColor = (...codes: number[]) =>
    codes.map(x => `\x1b[${x}m`).join('');

const COLOR = {
    reset: createColor(0, 0),
    gray: createColor(30, 89),
    red: createColor(31, 89),
    green: createColor(32, 89),
    yellow: createColor(33, 89),
    blue: createColor(34, 89),
    magenta: createColor(35, 89),
    cyan: createColor(36, 89),
    white: createColor(37, 89),
} as const;
type COLOR = typeof COLOR;

const TYPE = {
    error: 'red',
    success: 'green',
    info: 'blue',
} as const;
type TYPE = typeof TYPE;

export { COLOR, TYPE };
