import fs from 'node:fs/promises';

const GROUP_BEGIN = /^\s*group\s+([a-z0-9-]+)\s+{/;

const execAndEat = (
    text: string,
    regex: RegExp,
    fn?: (...args: string[]) => void,
    eater?: (...args: string[]) => string,
): [string, boolean] => {
    if (!regex.test(text)) {
        return [text, false];
    }

    const matches = Array.from(regex.exec(text)!);
    fn?.(...matches);

    if (!eater) {
        eater = main => main;
    }

    return [text.substring(eater(...matches).length), true];
};

type Rule = {
    regex: RegExp;
    fn?: (...args: string[]) => void;
    eater?: (...args: string[]) => string;
};

type Rules = Rule[];

const rules: Rules = [{
    regex: /^\s*group\s+([a-z0-9-]+)\s+{/,
    fn: (m0, m1) => {
        console.log(`found group "${m1}"`);
    },
}, {
    regex: /^[\s\n\r\t]+/,
    fn: () => {
        console.log('found whitespace');
    },
}];

class Thread {
    path = '';

    source = '';

    sourceTail = '';

    collectedStructure = {};

    currentContext = [];

    doneParsing = false;

    setSource = (source: string) => {
        this.source = source;
        this.sourceTail = source;
    };

    run = () => {
        for (const rule of rules) {
            const [result, done] = execAndEat(
                this.sourceTail,
                rule.regex,
                rule.fn,
                rule.eater,
            );

            if (done) {
                this.sourceTail = result;
                return;
            }
        }

        this.doneParsing = true;

        if (this.sourceTail.length === 0) {
            console.log('success!');
        } else {
            console.log('failed!');
        }
    };
}

export class Parser {
    fromFile = async (file: string) => {
        const content = await fs.readFile(file, {
            encoding: 'utf-8',
        });

        return await this.fromText(file, content);
    };

    fromText = async (path: string, source: string) =>{
        const thread = new Thread();
        thread.setSource(source);
        thread.path = path;
        this.parseLoop(thread);
    };

    parseLoop = (thread: Thread) => {
        while (!thread.doneParsing) {
            thread.run();
        }

        console.log('done');
    };
}