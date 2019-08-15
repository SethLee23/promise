let Promise = require('./newPromise');

let promise = new Promise(function (resolve, reject) {
    reject(100);
})

// promise.then().then().then(function (data) {
//     console.log('data:', data);
// },function (err) {
//     console.log('err:', err);
// })