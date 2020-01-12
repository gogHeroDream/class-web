const express=require('express');
const app=express();
// session
const session =require('express-session')
const flash = require('connect-flash')
const routes = require("./routes")
app.set('view engine', 'ejs');
app.use('/upload', express.static('./upload'))
app.use(express.static('./public'));

// session 中间件
const configSession= {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  };
app.use(session({
    name: configSession.key, // 设置 cookie 中保存 session id 的字段名称
    secret: configSession.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: true, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: configSession.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    // store: new MongoStore({// 将 session 存储到 mongodb
    //     url: config.mongodb// mongodb 地址
    // })
}))
// flash 中间件，用来显示通知
app.use(flash())
// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user
    res.locals.avatar = req.session.avatar
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
})
routes(app)
app.listen(3000)