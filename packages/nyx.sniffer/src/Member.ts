import type { Node } from './Node';

export class Member {
    parent: Node;

    constructor(readonly id: string) {}
}