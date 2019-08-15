
// new Promise((resolve, reject) => {
//     resolve(xxx)
//     reject(yyy)
// }).then(value => {
//     console.log(value)
// }, reason => {
//     console.log(reason)
// })

class newPromise {
    constructor(executor){
     if(typeof executor !== 'function'){
        throw new TypeError(`Promise resolver ${executor} is not a function`)
     }
     // 初始化值
     this.value = null
     this.reason = null
     this.status = 'pending'
     // 定义 resolve 函数和 reject 函数
     const resolve = (value)=>{
         // 成功后的操作:改变状态，成功后执行回调
         if(this.status === 'pendding'){
             this.status = 'fulfilled'
             this.value = value
         }
     }
     const reject = (reason)=>{
         // 失败后的操作：改变状态，失败后执行回调
         if(this.status === 'pendding'){
            this.status = 'rejected'
            this.reason = reason
        }
     }
     executor(resolve,reject)
    }
}
module.exports = newPromise;