
class Promise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is not a function`)
    }
    this.initialValue()
    this.initBind()
    // 原生 promise 中异常处理在 reject 函数中
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }

  }
  initBind() {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }
  initialValue() {
    // 初始化值
    this.value = null
    this.reason = null
    this.status = Promise.PENDING
    // 添加成功和时报回调
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
  }
  // 定义 resolve 函数和 reject 函数
  resolve(value) {
    // 成功后的操作:改变状态，成功后执行回调
    if (this.status === Promise.PENDING) {
      this.status = Promise.FULFILLED
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => {
        fn(this.value)
      })
    }
  }
  reject(reason) {
    // 失败后的操作：改变状态，失败后执行回调
    if (this.status === Promise.PENDING) {
      this.status = Promise.REJECTED
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => {
        fn(this.reason)
      })
    }
  }

  then(onFulfilled, onRejected) {
    // 值的穿透问题,参数校验
    if (typeof onFulfilled !== 'function') {
      onFulfilled = function (value) {
        return value
      }
    }
    if (typeof onRejected !== 'function') {
      onRejected = function (reason) {
        throw reason
      }
    }

    // 实现链式调用，且改变后面的 then 的值，必须通过新的实例
    let promise2 = new Promise((resolve, reject) => {

      // 实现异步操作
      if (this.status === Promise.FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            Promise.resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }

        })

      }
      if (this.status === Promise.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            Promise.resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }

        })

      }
      // pending 状态下将要执行的函数放到数组中
      if (this.status === Promise.PENDING) {
        this.onFulfilledCallbacks.push((value) => {
          setTimeout(() => {
            try {
              let x = onFulfilled(value)
              Promise.resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }

          })
        })
        this.onRejectedCallbacks.push(reason => {
          setTimeout(() => {
            try {
              let x = onRejected(reason)
              Promise.resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }

          })
        })
      }

    })

    return promise2

  }
}
Promise.PENDING = 'pending'
Promise.FULFILLED = 'fulfilled'
Promise.REJECTED = 'rejected'


Promise.resolvePromise = function (promise2, x, resolve, reject) {
  // 避免链式效应
  if (promise2 === x) {
    reject(new TypeError('Chaining circle detected for promise'))
  }
  let called = false
  if (x instanceof Promise) {
    // 判断 x 是否为 promise
    x.then(value => {
      Promise.resolvePromise(promise2, value, resolve, reject)
    }, reason => {
      reject(reason)
    })
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 判断 x 是否为对象或者函数
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(x, value => {
          if (called) return
          called = true
          Promise.resolvePromise(promise2, value, resolve, reject)
        }, reason => {
          if (called) return
          called = true
          reject(reason)
        })
      } else {
        if (called) return
        called = true
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }

  } else {
    resolve(x)
  }
}

module.exports = Promise;