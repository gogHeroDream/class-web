const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'nodeStudy';
// Use connect method to connect to the Server
function _connectDB(callback) {
    // Create a new MongoClient
    const client = new MongoClient(url, { useUnifiedTopology: true });
    client.connect(function (err) {
        if(err) {
            callback(err,null)
        } else {
            console.log("Connected successfully to server");
            // const db = client.db(dbName);
            callback(err,client)
        }
    });
}
module.exports={
    // 新增一个
    insertOne: function (collectionName, json, callback) {
        if (typeof collectionName === "string" && Object.prototype.toString.call(json) === '[object Object]' && typeof callback === 'function') {
            _connectDB(function (err, client) {
                if (err) {
                    callback(err, client)
                    client.close()
                } else {
                    const db = client.db(dbName);
                    db.collection(collectionName).insertOne(json, function (err, r) {
                        callback(err, r)
                        // console.log(r)
                        client.close()
                    });
                }
            })
        } else {
            throw new Error('传参有误！')
            return;
        }
    },
    // 新增多个
    insertMany: function (collectionName, json, callback) {
        if (typeof collectionName === "string"&&Array.isArray(json)&&typeof callback==='function') {
            _connectDB(function (err, client) {
                if (err) {
                    callback(err, client)
                    client.close()
                } else {
                    const db = client.db(dbName);
                    db.collection(collectionName).insertMany(json, function (err, r) {
                        callback(err, r)
                        // console.log(r)
                        client.close()
                    });
                }
            })
        } else {
            throw new Error('传参有误！')
            return;
        }
    },
    // 删除一个
    deleteOne: function (collectionName, json, callback) {
        if (typeof collectionName === "string" && Object.prototype.toString.call(json) === '[object Object]' && typeof callback === 'function') {
            _connectDB(function (err, client) {
                if (err) {
                    callback(err, client)
                    client.close()
                } else {
                    const db = client.db(dbName);
                    db.collection(collectionName).deleteOne(json, function (err, r) {
                        callback(err, r)
                        // console.log(r)
                        client.close()
                    });
                }
            })
        } else {
            throw new Error('传参有误！')
            return;
        }
    },
    // 删除多个
    deleteMany: function (collectionName, json, callback) {
        if (typeof collectionName === "string" && Object.prototype.toString.call(json) === '[object Object]' && typeof callback === 'function') {
            _connectDB(function (err, client) {
                if (err) {
                    callback(err, client)
                    client.close()
                } else {
                    const db = client.db(dbName);
                    db.collection(collectionName).deleteMany(json, function (err, r) {
                        callback(err, r)
                        // console.log(r)
                        client.close()
                    });
                }
            })
        } else {
            throw new Error('传参有误！')
            return;
        }
    },
    // 修改一个
    updateOne: function (collectionName, findJson, json, callback) {
        if (typeof collectionName === "string" && Object.prototype.toString.call(findJson) === '[object Object]' && Object.prototype.toString.call(json) === '[object Object]' && typeof callback === 'function') {
            _connectDB(function (err, client) {
                if (err) {
                    callback(err, client)
                    client.close()
                } else {
                    const db = client.db(dbName);
                    db.collection(collectionName).updateOne(findJson, json, function (err, r) {
                        callback(err, r)
                        // console.log(r)
                        client.close()
                    });
                }
            })
        } else {
            throw new Error('传参有误！')
            return;
        }
    },
    // 修改多个
    updateMany: function (collectionName, findJson, json, callback) {
        if (typeof collectionName === "string" && Object.prototype.toString.call(findJson) === '[object Object]' && Object.prototype.toString.call(json) === '[object Object]' && typeof callback === 'function') {
            _connectDB(function (err, client) {
                if (err) {
                    callback(err, client)
                    client.close()
                } else {
                    const db = client.db(dbName);
                    db.collection(collectionName).updateMany(findJson, json, function (err, r) {
                        callback(err, r)
                        // console.log(r)
                        client.close()
                    });
                }
            })
        } else {
            throw new Error('传参有误！')
            return;
        }
    },
    // 查找 可以 传 分页内容也可以不传 c规定 可传callback 可传 page pageAmount sort total
    find: function (collectionName, json, C, D) {
        const flag1 = arguments.length === 3 && typeof collectionName === "string" && Object.prototype.toString.call(json) === '[object Object]' && typeof C === 'function'
        const flag2 = arguments.length === 4 && typeof collectionName === "string" && Object.prototype.toString.call(json) === '[object Object]' && Object.prototype.toString.call(C) === '[object Object]' && typeof D === 'function'
        var result = [];    //结果数组
        // console.log(flag1, flag2)
        if (flag1 || flag2) {
            let callback,skipNumber,limit,sort,total;
            if(arguments.length === 3) {
               callback = C;
               skipNumber = 0;
                //数目限制
               limit = 0;
               sort = {};
            } else {
                callback = D;
                args = C;
                //应该省略的条数
                skipNumber = args.pageAmount * (args.page-1) - 0 || 0;
                //数目限制
                limit = args.pageAmount - 0 || 0;
                //排序方式
                sort = args.sort || {};
                total = args.total
            }
            _connectDB(function (err, client) {
                if (err) {
                    callback(err, client)
                    client.close()
                } else {
                    const db = client.db(dbName);
                    db.collection(collectionName).find(json).skip(skipNumber).limit(limit).sort(sort).toArray(function (err, r) {
                        // console.log(r)
                        if (total==='showTotal') {
                            if(err) {
                                callback(err,r)
                                client.close()
                            } else {
                                const result = {};
                                db.collection(collectionName).countDocuments(json)
                                .then(count=>{
                                    result.total = count
                                    result.items = r
                                    callback(err, result)
                                    client.close()
                                })
                                .catch(err=>{
                                    callback(err, null)
                                    client.close()
                                })
                                
                            }
                        }else {
                            callback(err, r)
                            client.close()
                        }
                    });
                }
            })
        } else {
            throw new Error('传参有误！');
            return;
        }
    }
}
// client.connect(function (err) {
//     // assert.equal(null, err);
//     console.log("Connected successfully to server");
//     const db = client.db(dbName);
//     db.collection('student').insertOne({ age: 9664 }, function (err, r) {
//         // assert.equal(null, err);
//         // assert.equal(1, r.insertedCount);

//         // Insert multiple documents
//         console.log('123')
//         // db.collection('student').insertMany([{ a: 2 }, { a: 3 }], function (err, r) {
//         //     assert.equal(null, err);
//         //     assert.equal(2, r.insertedCount);

//         //     client.close();
//         // });
//     });
//     client.close();
// });