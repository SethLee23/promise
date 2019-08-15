let Promise = require('./promise');
new Promise((resolve, reject) => {
    console.log('开始')
    resolve(6564222)
}).then(
    (a)=>{console.log('a',a)},
    reason => {
        console.log('reason:', reason)
    }
)

// promise.then().then().then(function (data) {
//     console.log('data:', data);
// },function (err) {
//     console.log('err:', err);
// })