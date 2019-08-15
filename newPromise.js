// new Promise((resolve, reject) => {
//     resolve(xxx)
//     reject(yyy)
// }).then(value => {
//     console.log(value)
// }, reason => {
//     console.log(reason)
// })

class newPromise {
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
    }
    // 定义 resolve 函数和 reject 函数
    resolve(value) {
        // 成功后的操作:改变状态，成功后执行回调
        if (this.status === Promise.PENDING) {
            this.status = Promise.FULFILLED
            this.value = value
        }
    }
    reject(reason) {
        // 失败后的操作：改变状态，失败后执行回调
        if (this.status === Promise.PENDING) {
            this.status = Promise.REJECTED
            this.reason = reason
        }
    }
    then(onFulfilled, onRejected) {
        // 值得穿透问题,参数校验
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
        // 实现异步操作
        if (this.status === Promise.FULFILLED) {
            setTimeout(() => {
                onFulfilled(this.value)
            })

        }
        if (this.status === Promise.REJECTED) {
            setTimeout(() => {
                onRejected(this.reason)
            })

        }
        if(this.status === Promise.PENDING){
            
        }
    }
}
Promise.PENDING = 'pending'
Promise.FULFILLED = 'fulfilled'
Promise.REJECTED = 'rejected'
module.exports = newPromise;