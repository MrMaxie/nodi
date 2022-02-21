
import { assert, scope, setup, nyx } from './Nyx';
import { debug } from './A';
import { Deferred } from '@nodi/core';

const { it } = setup(() => ({
    debug,
}));

scope('debug', () => {
    it('should be done', ctx => {
        const defer = new Deferred();

        ctx.debug.orDo(() => {
            defer.resolve();
        });

        setTimeout(() => {
            defer.reject();
        });

        return defer.promise;
    });

    it('should be true', ctx => {
        ctx.debug.isEnabled = true;

        assert(
            () => ctx.debug.isEnabled !== true
            f => f`Value ${'debug.isEnabled'} have to not be ${true} but is ${ctx.debug.isEnabled}`
        );
    });
});

nyx.run('should be true');
