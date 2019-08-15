// 1. 实现基本结构
// 2. 实现then方法
// 3. 实现链式调用
function Promise(executor) {
    var self = this
  
    self.status = 'pending'
    self.onResolvedCallback = []
    self.onRejectedCallback = []
  
    function resolve(value) {
      if (value instanceof Promise) {
        return value.then(resolve, reject)
      }
      setTimeout(function() { // 异步执行所有的回调函数
        if (self.status === 'pending') {
          self.status = 'resolved'
          self.data = value
          for (var i = 0; i < self.onResolvedCallback.length; i++) {
            self.onResolvedCallback[i](value)
          }
        }
      })
    }
  
    function reject(reason) {
      setTimeout(function() { // 异步执行所有的回调函数
        if (self.status === 'pending') {
          self.status = 'rejected'
          self.data = reason
          for (var i = 0; i < self.onRejectedCallback.length; i++) {
            self.onRejectedCallback[i](reason)
          }
        }
      })
    }
  
    try {
      executor(resolve, reject)
    } catch (reason) {
      reject(reason)
    }
  }
/*  
resolvePromise函数即为根据x的值来决定newPromise的状态的函数
也即标准中的[Promise Resolution Procedure](https://promisesaplus.com/#point-47)
x为`newPromise = promise1.then(onResolved, onRejected)`里`onResolved/onRejected`的返回值
`resolve`和`reject`实际上是`newPromise`的`executor`的两个实参，因为很难挂在其它的地方，所以一并传进来。
相信各位一定可以对照标准把标准转换成代码，这里就只标出代码在标准中对应的位置，只在必要的地方做一些解释
*/
  function resolvePromise(newPromise, x, resolve, reject) {
    var then
    var thenCalledOrThrow = false
  
    if (newPromise === x) {
      return reject(new TypeError('Chaining cycle detected for promise!'))
    }
  
    if (x instanceof Promise) {
      if (x.status === 'pending') { //because x could resolved by a Promise Object
        x.then(function(v) {
          resolvePromise(newPromise, v, resolve, reject)
        }, reject)
      } else { //but if it is resolved, it will never resolved by a Promise Object but a static value;
        x.then(resolve, reject)
      }
      return
    }
  
    if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
      try {
        then = x.then //because x.then could be a getter
        if (typeof then === 'function') {
          then.call(x, function rs(y) {
            if (thenCalledOrThrow) return
            thenCalledOrThrow = true
            return resolvePromise(newPromise, y, resolve, reject)
          }, function rj(r) {
            if (thenCalledOrThrow) return
            thenCalledOrThrow = true
            return reject(r)
          })
        } else {
          resolve(x)
        }
      } catch (e) {
        if (thenCalledOrThrow) return
        thenCalledOrThrow = true
        return reject(e)
      }
    } else {
      resolve(x)
    }
  }
  
  Promise.prototype.then = function(onResolved, onRejected) {
    var self = this
    var newPromise
    onResolved = typeof onResolved === 'function' ? onResolved : function(v) {
      return v
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function(r) {
      throw r
    }
  
    if (self.status === 'resolved') {
      return newPromise = new Promise(function(resolve, reject) {
        setTimeout(function() { // 异步执行onResolved
          try {
            var x = onResolved(self.data)
            resolvePromise(newPromise, x, resolve, reject)
          } catch (reason) {
            reject(reason)
          }
        })
      })
    }
  
    if (self.status === 'rejected') {
      return newPromise = new Promise(function(resolve, reject) {
        setTimeout(function() { // 异步执行onRejected
          try {
            var x = onRejected(self.data)
            resolvePromise(newPromise, x, resolve, reject)
          } catch (reason) {
            reject(reason)
          }
        })
      })
    }
  
    if (self.status === 'pending') {
      // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容已是异步执行，构造函数里的定义
      return newPromise = new Promise(function(resolve, reject) {
        self.onResolvedCallback.push(function(value) {
          try {
            var x = onResolved(value)
            resolvePromise(newPromise, x, resolve, reject)
          } catch (r) {
            reject(r)
          }
        })
  
        self.onRejectedCallback.push(function(reason) {
            try {
              var x = onRejected(reason)
              resolvePromise(newPromise, x, resolve, reject)
            } catch (r) {
              reject(r)
            }
          })
      })
    }
  }
  
  Promise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected)
  }
  
  Promise.deferred = Promise.defer = function() {
    var dfd = {}
    dfd.promise = new Promise(function(resolve, reject) {
      dfd.resolve = resolve
      dfd.reject = reject
    })
    return dfd
  }
module.exports = Promise;