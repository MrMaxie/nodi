import { Member } from './Member';
import { Node } from './Node';

type RawNodes = {
    nodes: Array<{
        id: string;
        isModule?: boolean;
        isFirst?: boolean;
        type?: string;
    }>;
    edges: Array<{
        a: string;
        b: string;
    }>;
};

const isObject = (x: unknown): x is object =>
    x && typeof x === 'object' && x !== null;

const isArray = (x: unknown): x is Array<unknown> =>
    x && Array.isArray(x);

export class Nodes {
    nodes: Node[] = [];

    members: Member[] = [];

    moduleNodes: Node[] = [];

    firstNodes: Node[] = [];

    constructor(rawNodes: RawNodes, border = 1) {
        if (!(
            isObject(rawNodes) &&
            isArray(rawNodes.nodes) &&
            isArray(rawNodes.edges)
        )) {
            return;
        }

        for (const rawNode of rawNodes.nodes) {
            if (typeof rawNode.id !== 'string') {
                continue;
            }

            if (rawNode.type === 'member' || rawNode.type === 'method') {
                this.pushMember(rawNode);
                continue;
            }

            this.pushNode(rawNode);
        }

        this.nodes.forEach((node, i) => {
            node.i = i;
        });

        const maxX = Math.ceil(Math.sqrt(this.nodes.length));

        for (const node of this.nodes) {
            node.x = (node.i % maxX) * border;
            node.y = Math.floor(node.i / maxX) * border;
        }

        for (const edge of rawNodes.edges) {
            const nodeA = this.findNode(node => node.id === edge.b && node.type === 'class');
            const memberB = this.findMember(member => member.id === edge.a);

            if (nodeA && memberB) {
                console.log(nodeA, memberB);
            }
        }

        for (const edge of rawNodes.edges) {
            const nodeA = this.findNode(node => node.id === edge.a);
            const nodeB = this.findNode(node => node.id === edge.b);

            if (!nodeA || !nodeB || nodeA === nodeB) {
                continue;
            }

            nodeA.pushOut(nodeB);
            nodeB.pushIn(nodeA);
        }
    }

    private pushNode = (rawNode: RawNodes['nodes'][0]) => {
        const node = new Node(rawNode.id);

        this.nodes.push(node);

        if (rawNode.isModule) {
            this.moduleNodes.push(node);
        }

        if (rawNode.isFirst) {
            this.firstNodes.push(node);
        }

        node.setType(rawNode.type);
    };

    private pushMember = (rawNode: RawNodes['nodes'][0]) => {
        const member = new Member(rawNode.id);

        this.members.push(member);
    };

    findNode = (cb: (node: Node) => boolean) => {
        return this.nodes.find(cb);
    };

    findMember = (cb: (node: Member) => boolean) => {
        return this.members.find(cb);
    };

    draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);

        for (const node of this.nodes) {
            node.draw(ctx);
        }
    };

    isSharingPosition = (a: Node) => {
        for (const b of this.nodes) {
            if (b !== a && b.x === a.x && b.y === a.y) {
                return true;
            }
        }
        return false;
    };

    isUsedPosition = (x: number, y: number) => {
        for (const node of this.nodes) {
            if (x === node.x && y === node.y) {
                return true;
            }
        }

        return false;
    };

    moveToClosestFree = (a: Node) => {
        let depth = 0;
        const pool = [0];

        let deltaX = 0;
        let deltaY = 0;
        let isFound = false;

        const search = () => {
            for (const x of pool) {
                for (const y of pool) {
                    if (!this.isUsedPosition(a.x + x, a.y + y)) {
                        isFound = true;
                        deltaX = x;
                        deltaY = y;
                    }
                }
            }
        };

        while (!isFound) {
            depth += 1;
            pool.push(depth * -1, depth);
            search();
        }

        a.x += deltaX;
        a.y += deltaY;
    };

    doGravity = (nTimes = 1, mTimes = 1, power = .2) => {
        for (let i = 0; i < nTimes; i++) {
            for (let j = 0; j < Math.max(1, mTimes); j++) {
                for (const node of this.nodes) {
                    node.doGravity(power);
                }
            }

            for (const node of this.nodes) {
                node.doRound();
            }

            for (const node of this.nodes) {
                if (this.isSharingPosition(node)) {
                    this.moveToClosestFree(node);
                }
            }
        }

        const minX = Math.min(...this.nodes.map(n => n.x)) * -1;
        const minY = Math.min(...this.nodes.map(n => n.y)) * -1;

        for (const node of this.nodes) {
            node.x += minX;
            node.y += minY;
        }
    }
}
