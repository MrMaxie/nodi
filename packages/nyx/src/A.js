"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = void 0;
class Debug {
    isEnabled = false;
    orDo = (fn) => {
        if (!this.isEnabled) {
            fn();
        }
    };
}
exports.debug = new Debug();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkEudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sS0FBSztJQUNQLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFFbEIsSUFBSSxHQUFHLENBQUMsRUFBYyxFQUFFLEVBQUU7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDakIsRUFBRSxFQUFFLENBQUM7U0FDUjtJQUNMLENBQUMsQ0FBQztDQUNMO0FBRVksUUFBQSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIERlYnVnIHtcclxuICAgIGlzRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgIG9yRG8gPSAoZm46ICgpID0+IHZvaWQpID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIGZuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlYnVnID0gbmV3IERlYnVnKCk7XHJcbiJdfQ==