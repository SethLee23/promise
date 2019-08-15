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
        executor(this.resolve, this.reject)
    }
    initBind() {
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }
    initialValue() {
        // 初始化值
        this.value = null
        this.reason = null
        this.status = 'pending'
    }
    // 定义 resolve 函数和 reject 函数
    resolve() {
        console.log('1111')
        // 成功后的操作:改变状态，成功后执行回调
        if (this.status === 'pendding') {
            this.status = 'fulfilled'
            this.value = value
        }
    }
    reject() {
        // 失败后的操作：改变状态，失败后执行回调
        if (this.status === 'pendding') {
            this.status = 'rejected'
            this.reason = reason
        }
    }
}
module.exports = newPromise;