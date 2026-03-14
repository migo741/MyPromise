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
      this.#onFulfilled.forEach((fn) => fn());
    };
    const reject = (val) => {
      if (this.#state !== "pending") return;
      this.#state = "rejected";
      this.#error = val;
      this.#onReject.forEach((fn) => fn());
    };
    excutor(resolve, reject);
  }
  then(onFulfilled, onReject) {
    return new MyPromise((resolve, reject) => {
      const fulfilledFn = () => {
        try {
          const result = onFulfilled ? onFulfilled(this.#data) : this.#data;
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      const rejectedFn = () => {
        try {
          const result = onReject ? onReject(this.#error) : this.#data;
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      if (this.#state === "pending") {
        this.#onFulfilled.push(() => fulfilledFn(this.#data));
        this.#onReject.push(() => rejectedFn(this.#error));
      }
      if (this.#state === "fulfilled") {
        fulfilledFn();
      }
      if (this.#state === "rejected") {
        rejectedFn();
      }
    });
  }
}
