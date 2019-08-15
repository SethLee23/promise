
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
     // 定义 resolve 函数和 reject 函数
     const resolve = function(){}
     const reject = function(){}
     executor(resolve,reject)
    }
}
module.exports = newPromise;