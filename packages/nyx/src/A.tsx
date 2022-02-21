class Debug {
    isEnabled = false;

    orDo = (fn: () => void) => {
        if (!this.isEnabled) {
            fn();
        }
    };
}

export const debug = new Debug();
