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

function rejectedPromise(prom, reason) {
  if (prom.state !== promiseState.PENDING) return;

  prom.state = promiseState.REJECTED;
  prom.reason = reason;
}
function resolvePromise(prom, x) {
  if (prom.state !== promiseState.PENDING) return;

  if (isThenable(x)) {
    if (x === prom) rejectedPromise(prom, new TypeError("error"));
  } else {
    prom.state = promiseState.FULFILLED;
    prom.data = x;
  }
}

class MyPromise {
  private state = promiseState.PENDING; // 'pending' | 'fulfilled | 'rejected'
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
