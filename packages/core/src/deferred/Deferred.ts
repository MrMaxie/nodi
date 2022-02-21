export type Defer<T = void> = {
    resolve: (result: T) => void;
    reject: (result?: any) => void;
    promise: Promise<T>;

    isFulfilled: boolean;
    isRejected: boolean;
    isResolved: boolean;
};

enum Status {
    Working = 0,
    Fail = -1,
    Success = 1,
}

export class Deferred<T = void> {
    private status = Status.Working;

    private resolver!: (value: T) => void;

    private rejecter!: (reason?: any) => void;

    readonly promise = new Promise<T>((resolve, reject) => {
        this.resolver = resolve;
        this.rejecter = reject;
    });

    get isFulfilled() {
        return this.status !== Status.Working;
    }

    get isRejected() {
        return this.status === Status.Fail;
    }

    get isResolved() {
        return this.status === Status.Success;
    }

    resolve = (value: T) => {
        if (this.isFulfilled) {
            return;
        }

        this.status = Status.Success;

        setTimeout(() => {
            this.resolver(value);
        });
    };

    reject = (reason?: any) => {
        if (this.isFulfilled) {
            return;
        }

        this.status = Status.Fail;

        setTimeout(() => {
            this.rejecter(reason);
        });
    };
}
