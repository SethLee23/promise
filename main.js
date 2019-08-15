let Promise = require('./newPromise');

new Promise(function (resolve, reject) {
    console.log('1111')
    resolve(1)
})

// promise.then().then().then(function (data) {
//     console.log('data:', data);
// },function (err) {
//     console.log('err:', err);
// })