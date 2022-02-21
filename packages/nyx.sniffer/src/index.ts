
import { Nodes } from './Nodes';
import rawData from './data_mine.json';

const nodes = new Nodes(rawData, 3);

const canvas = document.getElementById('app') as HTMLCanvasElement;
const parent = document.getElementById('app-container') as HTMLDivElement;
const ctx = canvas.getContext('2d');

const draw = () => {
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    nodes.draw(ctx, canvas.width, canvas.height);

    // requestAnimationFrame(draw);
};

const main = () => {
    nodes.doGravity(1, 3, .15);
    (window as any)._n_ = nodes;

    if (!canvas || !parent || !ctx) {
        console.error('Cannot find one of elements', canvas, parent, ctx);
        return;
    }

    requestAnimationFrame(draw);
};

main();

