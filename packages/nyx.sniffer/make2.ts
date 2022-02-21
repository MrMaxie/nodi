import { Reader } from './reader';

const main = () => {
    const reader = new Reader(
        'E:/Projects/Rad4m/gogift/react-engine-frontend/app2',
        'src/index.tsx',
    );

    reader.start();
};

main();