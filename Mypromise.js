class MyPromise {
  #state = "pending";
  #data = undefined;
  #error = undefined;
  #onFulfilled = [];
  #onReject = [];

  constructor(excutor) {
    const resolve = (val) => {
      if (this.#state !== "pending") return;
      this.#state = "fulfilled";
      this.#data = val;
    };
    const reject = (val) => {
      if (this.#state !== "pending") return;
      this.#state = "rejected";
      this.#error = val;
    };
    excutor(resolve, reject);
  }
  then(onFulfilled, onReject) {
    if (this.#state === "pending") {
      this.#onFulfilled.push(() => onFulfilled(this.#data));
      this.#onReject.push(() => onReject(this.#error));
    }
    if (this.#state === "fulfilled") {
      this.#onFulfilled.forEach((fn) => fn());
    }
    if (this.#state === "rejected") {
      this.#onReject.forEach((fn) => fn());
    }
    return new MyPromise((resolve, reject) => {});
  }
}

const p = new Promise((resolve, reject) => {
  resolve(1);
})
  .then((val) => {
    console.log(val);
  })
  .then((val) => {
    console.log(val + 1);
  });
