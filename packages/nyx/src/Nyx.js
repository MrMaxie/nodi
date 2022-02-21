"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = exports.setup = exports.it = exports.scope = exports.nyx = void 0;
const core_1 = require("@nodi/core");
const types_1 = require("node:util/types");
class Nyx {
    currentScope = [];
    tests = [];
    scope = (description, fn) => {
        this.currentScope.push(description);
        fn();
        this.currentScope.pop();
    };
    it = (context) => (name, fn) => {
        this.tests.push({
            name,
            scope: [...this.currentScope],
            fn: fn.bind(undefined, context),
        });
    };
    run = (name, scope) => {
        const test = this.tests.find(scope
            ? (x => x.name === name && scope.join('-') === x.scope.join('-'))
            : (x => x.name === name));
        if (test) {
            test.fn();
        }
    };
    runDebugger = async () => {
        /*
        const cri = await Cri({
            port: 9229,
        });

        const { Debugger, Runtime } = cri;

        await Debugger.enable({});
        await Runtime.enable();

        await Debugger.setBreakpointsActive({
            active: true,
        });

        let omitted = 0;

        Debugger.on('paused', async e => {
            console.log('debugger =>', e);
            if (omitted === 0) {
                await Debugger.stepOut();
            } else {
                const objsIds = new Set<string>();
                const objs: any = {};

                for (const frame of e.callFrames) {
                    for (const scope of frame.scopeChain) {
                        if (scope.type === 'global') {
                            continue;
                        }

                        if (scope.object.objectId) {
                            objsIds.add(scope.object.objectId);
                        }
                    }
                }

                for (const objId of objsIds) {
                    const obj = await Runtime.getProperties({
                        objectId: objId,
                    });
                    objs[objId] = JSON.parse(JSON.stringify(obj));
                }

                await fs.writeFile('./callStack.json', JSON.stringify({ ...e, objs }, null, 4), { encoding: 'utf-8' });
            }
            omitted += 1;
        });

        Runtime.on('consoleAPICalled', ce => {
            console.log('console =>', ce);
        });

        await Debugger.resume({});
        */
    };
}
exports.nyx = new Nyx();
exports.scope = exports.nyx.scope;
const it = (name, fn) => {
    const universalIt = exports.nyx.it(undefined);
    universalIt(name, fn);
};
exports.it = it;
const setup = (contextGenerator) => {
    return {
        it: exports.nyx.it(contextGenerator()),
    };
};
exports.setup = setup;
class AssertionError extends Error {
}
const assert = async (test, messageMaker) => {
    await Promise.resolve()
        .then(() => {
        const res = test();
        if ((0, types_1.isPromise)(res)) {
            return res;
        }
        if (res) {
            return;
        }
        return res ? true : Promise.reject(new AssertionError(core_1.Logger.format `Assertion ${test} failed`));
    })
        .catch(err => {
        if (messageMaker) {
            throw new AssertionError(messageMaker(core_1.Logger.format));
        }
        throw err;
    });
};
exports.assert = assert;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnl4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTnl4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFDQUFvQztBQUNwQywyQ0FBNEM7QUFFNUMsTUFBTSxHQUFHO0lBQ0wsWUFBWSxHQUFhLEVBQUUsQ0FBQztJQUU1QixLQUFLLEdBSUEsRUFBRSxDQUFDO0lBRVIsS0FBSyxHQUFHLENBQ0osV0FBbUIsRUFDbkIsRUFBYyxFQUNoQixFQUFFO1FBQ0EsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEMsRUFBRSxFQUFFLENBQUM7UUFDTCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzVCLENBQUMsQ0FBQztJQUVGLEVBQUUsR0FBRyxDQUFJLE9BQXVCLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBWSxFQUFFLEVBQXdDLEVBQUUsRUFBRTtRQUM1RixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNaLElBQUk7WUFDSixLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDN0IsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQztTQUNsQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUM7SUFFRixHQUFHLEdBQUcsQ0FBQyxJQUFZLEVBQUUsS0FBZ0IsRUFBRSxFQUFFO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDOUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FDM0IsQ0FBQztRQUVGLElBQUksSUFBSSxFQUFFO1lBQ04sSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1NBQ2I7SUFDTCxDQUFDLENBQUM7SUFFRixXQUFXLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDckI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VBcURFO0lBQ04sQ0FBQyxDQUFDO0NBQ0w7QUFFWSxRQUFBLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRWhCLFFBQUEsS0FBSyxHQUFHLFdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDeEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBOEIsRUFBRSxFQUFFO0lBQy9ELE1BQU0sV0FBVyxHQUFHLFdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdEMsV0FBVyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFIVyxRQUFBLEVBQUUsTUFHYjtBQUNLLE1BQU0sS0FBSyxHQUFHLENBQUksZ0JBQXNDLEVBQUUsRUFBRTtJQUMvRCxPQUFPO1FBQ0gsRUFBRSxFQUFFLFdBQUcsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUNqQyxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBSlcsUUFBQSxLQUFLLFNBSWhCO0FBS0YsTUFBTSxjQUFlLFNBQVEsS0FBSztDQUFHO0FBRTlCLE1BQU0sTUFBTSxHQUFHLEtBQUssRUFBRSxJQUFVLEVBQUUsWUFBMkIsRUFBRSxFQUFFO0lBQ3BFLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRTtTQUNsQixJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1AsTUFBTSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFFbkIsSUFBSSxJQUFBLGlCQUFTLEVBQUMsR0FBRyxDQUFDLEVBQUU7WUFDaEIsT0FBTyxHQUFHLENBQUM7U0FDZDtRQUVELElBQUksR0FBRyxFQUFFO1lBQ0wsT0FBTztTQUNWO1FBRUQsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLGNBQWMsQ0FBQyxhQUFNLENBQUMsTUFBTSxDQUFBLGFBQWEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3BHLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNULElBQUksWUFBWSxFQUFFO1lBQ2QsTUFBTSxJQUFJLGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDekQ7UUFFRCxNQUFNLEdBQUcsQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUFDO0FBQ1gsQ0FBQyxDQUFDO0FBdEJXLFFBQUEsTUFBTSxVQXNCakIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnbm9kZTpmcy9wcm9taXNlcyc7XHJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJ0Bub2RpL2NvcmUnO1xyXG5pbXBvcnQgeyBpc1Byb21pc2UgfSBmcm9tICdub2RlOnV0aWwvdHlwZXMnO1xyXG5cclxuY2xhc3MgTnl4IHtcclxuICAgIGN1cnJlbnRTY29wZTogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICB0ZXN0czogQXJyYXk8e1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgICAgICBzY29wZTogc3RyaW5nW107XHJcbiAgICAgICAgZm46ICgpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+O1xyXG4gICAgfT4gPSBbXTtcclxuXHJcbiAgICBzY29wZSA9IChcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgICAgIGZuOiAoKSA9PiB2b2lkLFxyXG4gICAgKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NvcGUucHVzaChkZXNjcmlwdGlvbik7XHJcbiAgICAgICAgZm4oKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY29wZS5wb3AoKTtcclxuICAgIH07XHJcblxyXG4gICAgaXQgPSA8VD4oY29udGV4dDogVCB8IFByb21pc2U8VD4pID0+IChuYW1lOiBzdHJpbmcsIGZuOiAoY29udGV4dDogVCkgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pID0+IHtcclxuICAgICAgICB0aGlzLnRlc3RzLnB1c2goe1xyXG4gICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICBzY29wZTogWy4uLnRoaXMuY3VycmVudFNjb3BlXSxcclxuICAgICAgICAgICAgZm46IGZuLmJpbmQodW5kZWZpbmVkLCBjb250ZXh0KSxcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgcnVuID0gKG5hbWU6IHN0cmluZywgc2NvcGU/OiBzdHJpbmdbXSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRlc3QgPSB0aGlzLnRlc3RzLmZpbmQoc2NvcGVcclxuICAgICAgICAgICAgPyAoeCA9PiB4Lm5hbWUgPT09IG5hbWUgJiYgc2NvcGUuam9pbignLScpID09PSB4LnNjb3BlLmpvaW4oJy0nKSlcclxuICAgICAgICAgICAgOiAoeCA9PiB4Lm5hbWUgPT09IG5hbWUpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHRlc3QpIHtcclxuICAgICAgICAgICAgdGVzdC5mbigpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcnVuRGVidWdnZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgLypcclxuICAgICAgICBjb25zdCBjcmkgPSBhd2FpdCBDcmkoe1xyXG4gICAgICAgICAgICBwb3J0OiA5MjI5LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB7IERlYnVnZ2VyLCBSdW50aW1lIH0gPSBjcmk7XHJcblxyXG4gICAgICAgIGF3YWl0IERlYnVnZ2VyLmVuYWJsZSh7fSk7XHJcbiAgICAgICAgYXdhaXQgUnVudGltZS5lbmFibGUoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgRGVidWdnZXIuc2V0QnJlYWtwb2ludHNBY3RpdmUoe1xyXG4gICAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBvbWl0dGVkID0gMDtcclxuXHJcbiAgICAgICAgRGVidWdnZXIub24oJ3BhdXNlZCcsIGFzeW5jIGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGVidWdnZXIgPT4nLCBlKTtcclxuICAgICAgICAgICAgaWYgKG9taXR0ZWQgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IERlYnVnZ2VyLnN0ZXBPdXQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9ianNJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9ianM6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZnJhbWUgb2YgZS5jYWxsRnJhbWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBzY29wZSBvZiBmcmFtZS5zY29wZUNoYWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS50eXBlID09PSAnZ2xvYmFsJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5vYmplY3Qub2JqZWN0SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ianNJZHMuYWRkKHNjb3BlLm9iamVjdC5vYmplY3RJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvYmpJZCBvZiBvYmpzSWRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gYXdhaXQgUnVudGltZS5nZXRQcm9wZXJ0aWVzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0SWQ6IG9iaklkLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG9ianNbb2JqSWRdID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBhd2FpdCBmcy53cml0ZUZpbGUoJy4vY2FsbFN0YWNrLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7IC4uLmUsIG9ianMgfSwgbnVsbCwgNCksIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb21pdHRlZCArPSAxO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBSdW50aW1lLm9uKCdjb25zb2xlQVBJQ2FsbGVkJywgY2UgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY29uc29sZSA9PicsIGNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYXdhaXQgRGVidWdnZXIucmVzdW1lKHt9KTtcclxuICAgICAgICAqL1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG55eCA9IG5ldyBOeXgoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBzY29wZSA9IG55eC5zY29wZTtcclxuZXhwb3J0IGNvbnN0IGl0ID0gKG5hbWU6IHN0cmluZywgZm46ICgpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KSA9PiB7XHJcbiAgICBjb25zdCB1bml2ZXJzYWxJdCA9IG55eC5pdCh1bmRlZmluZWQpO1xyXG4gICAgdW5pdmVyc2FsSXQobmFtZSwgZm4pO1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0dXAgPSA8VD4oY29udGV4dEdlbmVyYXRvcjogKCkgPT4gUHJvbWlzZTxUPiB8IFQpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXQ6IG55eC5pdChjb250ZXh0R2VuZXJhdG9yKCkpLFxyXG4gICAgfTtcclxufTtcclxuXHJcbnR5cGUgVGVzdCA9ICgpID0+IFByb21pc2U8dW5rbm93bj4gfCB1bmtub3duO1xyXG50eXBlIE1lc3NhZ2VNYWtlciA9IChmb3JtYXQ6IHR5cGVvZiBMb2dnZXJbJ2Zvcm1hdCddKSA9PiBzdHJpbmc7XHJcblxyXG5jbGFzcyBBc3NlcnRpb25FcnJvciBleHRlbmRzIEVycm9yIHt9XHJcblxyXG5leHBvcnQgY29uc3QgYXNzZXJ0ID0gYXN5bmMgKHRlc3Q6IFRlc3QsIG1lc3NhZ2VNYWtlcj86IE1lc3NhZ2VNYWtlcikgPT4ge1xyXG4gICAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IHRlc3QoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc1Byb21pc2UocmVzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzID8gdHJ1ZSA6IFByb21pc2UucmVqZWN0KG5ldyBBc3NlcnRpb25FcnJvcihMb2dnZXIuZm9ybWF0YEFzc2VydGlvbiAke3Rlc3R9IGZhaWxlZGApKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVzc2FnZU1ha2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXNzZXJ0aW9uRXJyb3IobWVzc2FnZU1ha2VyKExvZ2dlci5mb3JtYXQpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG4iXX0=