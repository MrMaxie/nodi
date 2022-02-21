export class Node {
    readonly name: string;

    type = 'unknown';

    i = 0;

    out: Node[] = [];

    in: Node[] = [];

    x = 0;

    y = 0;

    constructor(
        readonly id: string,
    ) {
        this.name = id.replace(/\|.*$/, '');
    }

    setType = (type?: string) => {
        if (typeof type !== 'string') {
            return;
        }

        this.type = type;
    };

    pushOut = (node: Node) => {
        if (this.out.includes(node)) {
            return node;
        }

        this.out.push(node);
    };

    pushIn = (node: Node) => {
        if (this.in.includes(node)) {
            return node;
        }

        this.in.push(node);
    };

    doGravity = (power: number) => {
        for (const out of this.in) {
            const dx = (out.x - this.x) * power;
            const dy = (out.y - this.y) * power;

            out.x -= dx;
            out.y -= dy;
            this.x += dx / 2;
            this.y += dy / 2;
        }
    };

    doRound = () => {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    };

    get color() {
        switch (this.type) {
            case 'member': return '#008df8';
            case 'unknown': return '#af2c45';
            case 'file': return '#86af80';
            case 'var': return '#e8ae5b';
            case 'class': return '#ff8f40';
            case 'type_alias': return '#79d4d5';
            case 'method': return '#9a5feb';
            case 'interface': return '#70a598';
        }
        return '#bbbbbb';
    }

    draw = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.strokeStyle = '#232323';
        ctx.lineWidth = 3;
        ctx.rect((this.x * 20) + 10, (this.y * 20) + 10, 5, 5);
        ctx.fill();
        ctx.fillStyle = this.color;
        ctx.font = '16px "Roboto Mono"';
        ctx.textBaseline = 'top';
        // ctx.fillText('Hello world', (160 * this.x) + 20, (160 * this.y) + 20);
        ctx.closePath();
    };
}