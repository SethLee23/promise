let Promise = require('./promise');
new Promise((resolve, reject) => {
        console.log('开始')
        reject(6564222)
    })
    .then(
        (a) => {
            console.log('a', a)
            resolve(a)
        },
        reason => {
            console.log('reason:', reason)
        }
    ).then(a => {
        console.log('aaaa',a), reason => {
            console.log('reason1z:', reason)
        }
    })

// promise.then().then().then(function (data) {
//     console.log('data:', data);
// },function (err) {
//     console.log('err:', err);
// })