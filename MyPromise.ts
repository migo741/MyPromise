// 'pending' | 'fulfilled | 'rejected'
const promiseState = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};
function isObject(x) {
  return typeof x === "object" && x !== null;
}
function isFunction(x) {
  return typeof x === "function";
}
function isThenable(x) {
  return (isObject(x) || isFunction(x)) && typeof x.then === "function";
}
function resolvePromise(prom, x) {
  if (prom.state !== promiseState.PENDING) return;

  if (isThenable(x)) {
    // 1. x和prom是同一个东西
    if (x === prom) {
      rejectedPromise(prom, new TypeError("error"));
      return;
    }
    // 2. prom吸收x的状态
    queueMicrotask(() => {
      x.then(
        (data) => {
          resolvePromise(prom, data);
        },
        (err) => {
          rejectedPromise(prom, err);
        }
      );
    });
  } else {
    prom.state = promiseState.FULFILLED;
    prom.data = x;
  }
}

function rejectedPromise(prom, reason) {
  if (prom.state !== promiseState.PENDING) return;

  prom.state = promiseState.REJECTED;
  prom.reason = reason;
}

class MyPromise {
  #state = promiseState.PENDING; // 'pending' | 'fulfilled | 'rejected'
  private data = undefined; // 成功的数据
  private reason = undefined; // 失败的数据

  constructor(executor) {
    const resolve = (data: void) => {
      resolvePromise(this, data);
    };
    const rejected = (err: void) => {
      rejectedPromise(this, err);
    };
    executor(resolve, rejected);
  }
  then() {}
}

const p = new Promise((resolve, rejected) => {
  setTimeout(() => {
    resolve(p);
  }, 0);
});
