const express = require('express')
const router = express.Router()
const path = require('path');
// 取id 键值对
const ObjectId = require('mongodb').ObjectID;
const db = require("../model/db.js")
const checkLogin = require('../middlewares/check').checkLogin
// post的处理
const bodyParser = require('body-parser');
// 解析 application/json
router.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
router.use(bodyParser.urlencoded());
var multer = require('multer');
// 加密
const md5 = require('../model/md5')
function getExtension(extname) {
    return path.extname(extname)
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../upload/date'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + getExtension(file.originalname))
    }
})
var upload = multer({ storage: storage })

// 正式处理请求
router.get('/avatar', checkLogin, (req, res, next) => {
    // res.locals.arr = 123
    res.render('avatar', {
        active: 0
    })
})
router.post('/avatar', upload.single('avatar'), (req, res, next) => {
    const name = req.body.name
    if(!name) {
        res.send('-2')
        return;
    } else if (!req.file) {
        res.send('-3')
        return;
    } else {
        const filePath = path.join('upload', 'date', req.file.filename)
        db.updateMany('user', { name }, { $set: { avatar: filePath}},function(err,r){
            if(err) {
                console.log(err)
                res.send('-1')
            } else {
                req.session.avatar = filePath
                res.send('1')
            }
            return;
        })
    }
    // -1 服务器错误 -2 没有这个用户 -3 没上传成功
})
module.exports = router