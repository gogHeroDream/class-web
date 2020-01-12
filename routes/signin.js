const express = require('express')
const router = express.Router()
const path = require('path');
// 取id 键值对
const ObjectId = require('mongodb').ObjectID;
const db = require("../model/db.js")
const checkNotLogin = require('../middlewares/check').checkNotLogin
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
router.get('/', checkNotLogin, (req, res, next) => {
    // res.locals.arr = 123
    res.render('signin',{
        active: 0
    })
})
router.post('/', (req, res, next) => {
    const name = req.body.name
    const pwd = md5.type1(req.body.pwd);
    // -1 服务器错误 -2 没有这个用户 -3 用户名密码不匹配
    db.find('user', { name }, function (err, result) {
        if (err) {
            // req.flash('error', '服务器异常')
            // return res.redirect('back')
            res.send('-1')
            return;
        } else if (result.length == 0) {
            res.send('-2')
            return;
        } else {
            if(pwd === result[0].pwd){
                req.session.login = '1';
                req.session.user = result[0].name;
                req.session.avatar = result[0].avatar;
                res.send('1')
            } else {
                res.send('-3')
            }
            return;
        }
    })
    // res.send('1')
})
module.exports = router