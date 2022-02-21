import type Http from 'node:http';
import type Net from 'node:net';
import Express from 'express';
import GracefulExit from 'express-graceful-exit';
import { Deferred } from '@nodi/core';
import { Bunbun } from './Bunbun';

export class Server<Context> {
    private expressApp?: Express.Express;
    private expressServer?: Http.Server;

    private sockets: Net.Socket[] = [];

    constructor(
        private $: Bunbun<Context>,
    ) {}

    get express() {
        return {
            app: this.expressApp,
            http: this.expressServer,
        };
    }

    listen = (directory: string, port: number = 3000) => {
        const defer = new Deferred<typeof this.express>();

        const { $ } = this;

        const app = Express();

        app.use(GracefulExit.middleware(app));

        app.use(Express.static($.fs.resolve(directory)));

        app.get('*', (req, res) => {
            res.sendFile($.fs.resolve(directory, './index.html'));
        });

        const server = app.listen(port, () => {
            $.logger.log($.logger.format`Dev server listening on port ${port}`);
            defer.resolve(this.express);
        });

        GracefulExit.init(server);

        this.expressApp = app;
        this.expressServer = server;

        return defer.promise;
    };

    stop = () => {
        const defer = new Deferred();
        const { $ } = this;
        const { app, http } = this.express;

        if (!http || !app) {
            defer.resolve();
        } else {
            GracefulExit.gracefulExitHandler(app, http, {
                errorDuringExit: false,
                exitProcess: false,
                force: true,
                suicideTimeout: 300,
                log: false,
                callback: () => {
                    $.logger.log($.logger.format`Dev server has been stopped manually`);
                    defer.resolve();
                },
            });
        }

        return defer.promise;
    };
}
